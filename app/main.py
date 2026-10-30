from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from core.db import engine, Base
from models import expense as expense_model
from models import user as user_model
from routers.expense import expense_router
from routers.user import user_router

# Create the tables when the app starts, if they don't exist already
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spendly - Expense Tracker API")

# Allow the React app to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the expense and user routers to the main app
app.include_router(expense_router, prefix="/expenses")
app.include_router(user_router, prefix="/users")


# Simple route to check that the server is running
@app.get("/")
def home():
    return {"message": "bye bye spendly"}