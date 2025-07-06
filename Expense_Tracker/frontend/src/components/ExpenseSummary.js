import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

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

const ExpenseSummary = ({ totalData }) => {
  if (!totalData || !totalData.by_category) {
    return <p>No expense data available.</p>;
  }

  const { total, by_category } = totalData;
  
  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(by_category)
    .sort((a, b) => b[1] - a[1]);
  
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Expense Summary</Card.Header>
      <Card.Body>
        <Card.Title className="mb-4">
          Total Expenses: {formatCurrency(total)}
        </Card.Title>
        
        {sortedCategories.map(([category, amount]) => {
          const percentage = (amount / total * 100).toFixed(1);
          return (
            <div key={category} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span>
                  {formatCurrency(amount)} ({percentage}%)
                </span>
              </div>
              <ProgressBar 
                variant={getCategoryColor(category)} 
                now={percentage} 
              />
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default ExpenseSummary; 