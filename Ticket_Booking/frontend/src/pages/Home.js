import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBookingStats } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    total_events: 0,
    total_venues: 0,
    total_bookings: 0,
    total_revenue: 0,
    available_tickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookingStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h1 className="mb-4">Welcome to Ticket Booking System</h1>
      
      <p className="lead mb-4">
        Manage events, venues, ticket types, and bookings with our comprehensive system.
      </p>

      <h2 className="mb-3">System Overview</h2>
      
      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Header as="h5">Events</Card.Header>
              <Card.Body>
                <Card.Title>{stats.total_events}</Card.Title>
                <Card.Text>Total events in the system</Card.Text>
                <Link to="/events" className="btn btn-primary">View Events</Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Header as="h5">Venues</Card.Header>
              <Card.Body>
                <Card.Title>{stats.total_venues}</Card.Title>
                <Card.Text>Available venues for events</Card.Text>
                <Link to="/venues" className="btn btn-primary">View Venues</Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Header as="h5">Bookings</Card.Header>
              <Card.Body>
                <Card.Title>{stats.total_bookings}</Card.Title>
                <Card.Text>Total bookings made</Card.Text>
                <Link to="/bookings" className="btn btn-primary">View Bookings</Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Header as="h5">Revenue</Card.Header>
              <Card.Body>
                <Card.Title>${stats.total_revenue.toFixed(2)}</Card.Title>
                <Card.Text>Total revenue from confirmed bookings</Card.Text>
                <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Header as="h5">Available Tickets</Card.Header>
              <Card.Body>
                <Card.Title>{stats.available_tickets}</Card.Title>
                <Card.Text>Tickets available across all events</Card.Text>
                <Link to="/ticket-types" className="btn btn-primary">View Ticket Types</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      <h2 className="mt-4 mb-3">Quick Actions</h2>
      
      <Row>
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Create Event</Card.Title>
              <Card.Text>Add a new event to the system</Card.Text>
              <Link to="/events" className="btn btn-success">Create Event</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Add Venue</Card.Title>
              <Card.Text>Register a new venue</Card.Text>
              <Link to="/venues" className="btn btn-success">Add Venue</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Create Ticket Type</Card.Title>
              <Card.Text>Define new ticket types</Card.Text>
              <Link to="/ticket-types" className="btn btn-success">Create Type</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Make Booking</Card.Title>
              <Card.Text>Create a new booking</Card.Text>
              <Link to="/bookings" className="btn btn-success">Make Booking</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 