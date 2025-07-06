from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date
import enum

class CategoryEnum(str, enum.Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ENTERTAINMENT = "entertainment"
    UTILITIES = "utilities"
    RENT = "rent"
    OTHER = "other"

class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    category: CategoryEnum
    description: Optional[str] = None
    
    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

class ExpenseCreate(ExpenseBase):
    date: Optional[date] = None

class ExpenseUpdate(ExpenseBase):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[CategoryEnum] = None
    date: Optional[date] = None
    
class Expense(ExpenseBase):
    id: int
    date: date
    
    class Config:
        from_attributes = True

class TotalExpense(BaseModel):
    total: float
    by_category: dict 