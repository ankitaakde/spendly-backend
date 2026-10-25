from fastapi import FastAPI
from core.db import engine, Base
from models import expense as expense_model
from models import user as user_model
from routers.expense import expense_router
from routers.user import user_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spendly - Expense Tracker API")

app.include_router(expense_router, prefix="/expenses")
app.include_router(user_router, prefix="/users")


@app.get("/")
def home():
    return {"message": "bye bye spendly"}