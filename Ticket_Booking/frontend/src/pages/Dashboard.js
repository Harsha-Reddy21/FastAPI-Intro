import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { getBookingStats, getEvents, getVenues } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_events: 0,
    total_venues: 0,
    total_bookings: 0,
    total_revenue: 0,
    available_tickets: 0
  });
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, eventsData, venuesData] = await Promise.all([
          getBookingStats(),
          getEvents(),
          getVenues()
        ]);
        setStats(statsData);
        setEvents(eventsData);
        setVenues(venuesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="page-container">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="mb-4">Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Header as="h5">Total Revenue</Card.Header>
            <Card.Body>
              <h2 className="display-4">${stats.total_revenue.toFixed(2)}</h2>
              <p className="text-muted">From confirmed bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Header as="h5">Total Bookings</Card.Header>
            <Card.Body>
              <h2 className="display-4">{stats.total_bookings}</h2>
              <p className="text-muted">Across all events</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Header as="h5">Available Tickets</Card.Header>
            <Card.Body>
              <h2 className="display-4">{stats.available_tickets}</h2>
              <p className="text-muted">Remaining for purchase</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Upcoming Events</Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events
                      .filter(event => new Date(event.date) >= new Date())
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 5)
                      .map(event => (
                        <tr key={event.id}>
                          <td>{event.name}</td>
                          <td>{formatDate(event.date)}</td>
                          <td>{event.venue ? event.venue.name : 'N/A'}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No upcoming events</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Venue Capacity</Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Location</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.length > 0 ? (
                    venues.map(venue => (
                      <tr key={venue.id}>
                        <td>{venue.name}</td>
                        <td>{venue.location}</td>
                        <td>{venue.capacity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No venues available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header as="h5">System Statistics</Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h5>Total Events</h5>
                  <p className="lead">{stats.total_events}</p>
                </Col>
                <Col md={4} className="text-center">
                  <h5>Total Venues</h5>
                  <p className="lead">{stats.total_venues}</p>
                </Col>
                <Col md={4} className="text-center">
                  <h5>Booking to Ticket Ratio</h5>
                  <p className="lead">
                    {stats.total_bookings > 0 && stats.available_tickets > 0
                      ? ((stats.total_bookings / (stats.total_bookings + stats.available_tickets)) * 100).toFixed(1) + '%'
                      : '0%'}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 