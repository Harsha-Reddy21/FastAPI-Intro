import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const getCategoryColor = (category) => {
  const colors = {
    food: 'primary',
    transport: 'success',
    entertainment: 'info',
    utilities: 'warning',
    rent: 'danger',
    other: 'secondary'
  };
  return colors[category] || 'secondary';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const ExpenseTable = ({ expenses, onDelete, onEdit }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
            <td>
              <Badge bg={getCategoryColor(expense.category)}>
                {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
              </Badge>
            </td>
            <td>{expense.description || '-'}</td>
            <td className="text-end">{formatCurrency(expense.amount)}</td>
            <td>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => onEdit(expense)}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ExpenseTable; 