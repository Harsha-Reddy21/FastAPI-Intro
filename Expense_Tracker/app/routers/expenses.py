from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from sqlalchemy import func

from ..database import get_db
from ..models import Expense as ExpenseModel
from ..schemas import Expense, ExpenseCreate, ExpenseUpdate, TotalExpense

router = APIRouter(
    tags=["expenses"]
)

@router.get("/", response_model=List[Expense])
def get_expenses(
    db: Session = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    query = db.query(ExpenseModel)
    
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        query = query.filter(ExpenseModel.date <= end_date)
        
    return query.all()

@router.post("/", response_model=Expense, status_code=201)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = ExpenseModel(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date or date.today()
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.put("/{expense_id}", response_model=Expense)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return None

@router.get("/category/{category}", response_model=List[Expense])
def get_expenses_by_category(
    category: str,
    db: Session = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    query = db.query(ExpenseModel).filter(ExpenseModel.category == category)
    
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        query = query.filter(ExpenseModel.date <= end_date)
        
    return query.all()

@router.get("/total", response_model=TotalExpense)
def get_total_expenses(
    db: Session = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    query = db.query(ExpenseModel)
    
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        query = query.filter(ExpenseModel.date <= end_date)
    
    expenses = query.all()
    
    total = sum(expense.amount for expense in expenses)
    
    by_category = {}
    for expense in expenses:
        if expense.category not in by_category:
            by_category[expense.category] = 0
        by_category[expense.category] += expense.amount
    
    return {"total": total, "by_category": by_category} 