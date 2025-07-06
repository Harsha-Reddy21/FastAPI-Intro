import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import ExpenseSummary from './components/ExpenseSummary';

import {
  fetchExpenses,
  fetchExpensesByCategory,
  fetchTotalExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [totalData, setTotalData] = useState({ total: 0, by_category: {} });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const CATEGORIES = ['food', 'transport', 'entertainment', 'utilities', 'rent', 'other'];

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  // Load expenses when filters change
  useEffect(() => {
    loadExpenses();
  }, [selectedCategory, dateRange]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (selectedCategory) {
        data = await fetchExpensesByCategory(
          selectedCategory, 
          dateRange.startDate || null, 
          dateRange.endDate || null
        );
      } else {
        data = await fetchExpenses(
          dateRange.startDate || null, 
          dateRange.endDate || null
        );
      }
      
      setExpenses(data);
      
      // Get total data
      const totals = await fetchTotalExpenses(
        dateRange.startDate || null, 
        dateRange.endDate || null
      );
      setTotalData(totals);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      setLoading(false);
      console.error('Error loading expenses:', err);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError('');
      
      await createExpense(expenseData);
      loadExpenses();
      
      setLoading(false);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      setLoading(false);
      console.error('Error adding expense:', err);
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError('');
      
      await updateExpense(editingExpense.id, expenseData);
      setEditingExpense(null);
      loadExpenses();
      
      setLoading(false);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
      setLoading(false);
      console.error('Error updating expense:', err);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        setLoading(true);
        setError('');
        
        await deleteExpense(id);
        loadExpenses();
        
        setLoading(false);
      } catch (err) {
        setError('Failed to delete expense. Please try again.');
        setLoading(false);
        console.error('Error deleting expense:', err);
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Expense Tracker</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </Card.Header>
            <Card.Body>
              <ExpenseForm 
                onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                initialValues={editingExpense || {}}
              />
              
              {editingExpense && (
                <button 
                  className="btn btn-link mt-2" 
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </Card.Body>
          </Card>
          
          <ExpenseSummary totalData={totalData} />
        </Col>
        
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filter by Category</Form.Label>
                    <Form.Select 
                      value={selectedCategory} 
                      onChange={handleCategoryChange}
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              {loading ? (
                <p>Loading expenses...</p>
              ) : (
                <ExpenseTable 
                  expenses={expenses} 
                  onDelete={handleDeleteExpense} 
                  onEdit={handleEditExpense}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App; 