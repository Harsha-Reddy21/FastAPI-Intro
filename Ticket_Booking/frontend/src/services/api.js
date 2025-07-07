import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Events API
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEvent = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEventBookings = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}/bookings`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for event ${id}:`, error);
    throw error;
  }
};

export const getEventAvailableTickets = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}/available-tickets`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching available tickets for event ${id}:`, error);
    throw error;
  }
};

export const getEventRevenue = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}/revenue`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching revenue for event ${id}:`, error);
    throw error;
  }
};

// Venues API
export const getVenues = async () => {
  try {
    const response = await axios.get(`${API_URL}/venues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const getVenue = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    throw error;
  }
};

export const createVenue = async (venueData) => {
  try {
    const response = await axios.post(`${API_URL}/venues`, venueData);
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

export const getVenueEvents = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${id}/events`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching events for venue ${id}:`, error);
    throw error;
  }
};

export const getVenueOccupancy = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${id}/occupancy`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching occupancy for venue ${id}:`, error);
    throw error;
  }
};

// Ticket Types API
export const getTicketTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/ticket-types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    throw error;
  }
};

export const createTicketType = async (ticketTypeData) => {
  try {
    const response = await axios.post(`${API_URL}/ticket-types`, ticketTypeData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket type:', error);
    throw error;
  }
};

// Bookings API
export const getBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for booking ${id}:`, error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    await axios.delete(`${API_URL}/bookings/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
};

export const searchBookings = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching bookings:', error);
    throw error;
  }
};

// Statistics API
export const getBookingStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/booking-system/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
}; 