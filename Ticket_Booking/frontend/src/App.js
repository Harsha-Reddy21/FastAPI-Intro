import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Venues from './pages/Venues';
import TicketTypes from './pages/TicketTypes';
import Bookings from './pages/Bookings';
import EventDetails from './pages/EventDetails';
import VenueDetails from './pages/VenueDetails';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/ticket-types" element={<TicketTypes />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 