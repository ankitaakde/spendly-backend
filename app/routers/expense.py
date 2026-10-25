import calendar
from fastapi import APIRouter, Depends
from sqlalchemy import extract, func
from sqlalchemy.orm import Session
from core.db import get_db
from core.dependencies import get_current_user
from models.expense import Expense
from models.user import User
from schemas.expense import ExpenseRequestDto, ExpenseResponseDto
from schemas.Api_response import ApiResponse

expense_router = APIRouter()


# create expense
@expense_router.post("/")
def create_expense(expense_request_dto: ExpenseRequestDto, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_expense = Expense(
        name=expense_request_dto.name,
        amount=expense_request_dto.amount,
        category=expense_request_dto.category,
        date=expense_request_dto.date,
        user_id=current_user.id
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return ApiResponse(status="success", message="Expense created successfully", data={"expense": ExpenseResponseDto.model_validate(new_expense)})


# get all expenses of the logged in user
@expense_router.get("/")
def get_all_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
    return ApiResponse(status="success", message="Expenses retrieved successfully", data={"expenses": [ExpenseResponseDto.model_validate(e) for e in expenses]})


# search expenses by name
@expense_router.get("/search/")
def search_expense(name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.name.ilike(f"%{name}%")
    ).all()
    if not expenses:
        return ApiResponse(status="error", message="No expenses found", data=None)
    return ApiResponse(status="success", message="Expenses found", data={"expenses": [ExpenseResponseDto.model_validate(e) for e in expenses]})


# filter expenses by month, category and search
@expense_router.get("/filter/")
def filter_expenses(month: str = None, category: str = None, search: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Expense).filter(Expense.user_id == current_user.id)

    if month:
        try:
            year, month_number = month.split("-")
            query = query.filter(
                extract("year", Expense.date) == int(year),
                extract("month", Expense.date) == int(month_number)
            )
        except ValueError:
            return ApiResponse(status="error", message="Month must be in YYYY-MM format", data=None)

    if category:
        query = query.filter(Expense.category.ilike(category))

    if search:
        query = query.filter(Expense.name.ilike(f"%{search}%"))

    expenses = query.all()
    return ApiResponse(status="success", message="Expenses filtered successfully", data={"expenses": [ExpenseResponseDto.model_validate(e) for e in expenses]})


# analytics for a month
@expense_router.get("/analytics/")
def get_analytics(month: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        year, month_number = month.split("-")
        year = int(year)
        month_number = int(month_number)
    except ValueError:
        return ApiResponse(status="error", message="Month must be in YYYY-MM format", data=None)

    this_month = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        extract("year", Expense.date) == year,
        extract("month", Expense.date) == month_number
    ).all()

    total_spent = sum(e.amount for e in this_month)
    transaction_count = len(this_month)

    # previous month total
    if month_number == 1:
        prev_year, prev_month = year - 1, 12
    else:
        prev_year, prev_month = year, month_number - 1

    prev_total = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id,
        extract("year", Expense.date) == prev_year,
        extract("month", Expense.date) == prev_month
    ).scalar() or 0

    if prev_total > 0:
        change_percent = round(((total_spent - prev_total) / prev_total) * 100, 1)
    else:
        change_percent = None

    # category wise total
    breakdown = {}
    for e in this_month:
        breakdown[e.category] = breakdown.get(e.category, 0) + e.amount

    largest_category = max(breakdown, key=breakdown.get) if breakdown else None
    highest_expense = max((e.amount for e in this_month), default=0)

    days_in_month = calendar.monthrange(year, month_number)[1]
    daily_average = round(total_spent / days_in_month, 2)

    return ApiResponse(
        status="success",
        message="Analytics fetched successfully",
        data={
            "month": month,
            "total_spent": total_spent,
            "previous_month_total": prev_total,
            "change_percent": change_percent,
            "transaction_count": transaction_count,
            "category_breakdown": breakdown,
            "largest_category": largest_category,
            "highest_expense": highest_expense,
            "daily_average": daily_average
        }
    )


# get one expense by id
@expense_router.get("/{expense_id}")
def get_one_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == current_user.id).first()
    if not expense:
        return ApiResponse(status="error", message="Expense not found", data=None)
    return ApiResponse(status="success", message="Expense retrieved successfully", data={"expense": ExpenseResponseDto.model_validate(expense)})


# update expense by id
@expense_router.put("/{expense_id}")
def update_expense(expense_id: int, expense_request_dto: ExpenseRequestDto, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == current_user.id).first()
    if not expense:
        return ApiResponse(status="error", message="Expense not found", data=None)

    expense.name = expense_request_dto.name
    expense.amount = expense_request_dto.amount
    expense.category = expense_request_dto.category
    expense.date = expense_request_dto.date

    db.commit()
    db.refresh(expense)
    return ApiResponse(status="success", message="Expense updated successfully", data={"expense": ExpenseResponseDto.model_validate(expense)})


# delete expense by id
@expense_router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == current_user.id).first()
    if not expense:
        return ApiResponse(status="error", message="Expense not found", data=None)

    db.delete(expense)
    db.commit()
    return ApiResponse(status="success", message="Expense deleted successfully", data=None)