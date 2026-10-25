from pydantic import BaseModel
from datetime import date


class ExpenseRequestDto(BaseModel):
    name: str
    amount: float
    category: str
    date: date


class ExpenseResponseDto(BaseModel):
    id: int
    name: str
    amount: float
    category: str
    date: date

    class Config:
        from_attributes = True