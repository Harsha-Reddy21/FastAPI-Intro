import axios from 'axios';

const API_URL = '/api/expenses';

export const fetchExpenses = async (startDate = null, endDate = null) => {
  let url = API_URL;
  const params = {};
  
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const fetchExpensesByCategory = async (category, startDate = null, endDate = null) => {
  let url = `${API_URL}/category/${category}`;
  const params = {};
  
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const fetchTotalExpenses = async (startDate = null, endDate = null) => {
  let url = `${API_URL}/total`;
  const params = {};
  
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await axios.post(API_URL, expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await axios.put(`${API_URL}/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return true;
}; 