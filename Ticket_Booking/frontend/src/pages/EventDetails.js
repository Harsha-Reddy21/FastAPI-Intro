import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Table, Alert, Tab, Tabs } from 'react-bootstrap';
import { getEvent, getEventBookings, getEventAvailableTickets, getEventRevenue } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventData, bookingsData, ticketsData, revenueData] = await Promise.all([
          getEvent(id),
          getEventBookings(id),
          getEventAvailableTickets(id),
          getEventRevenue(id)
        ]);
        
        setEvent(eventData);
        setBookings(bookingsData);
        setAvailableTickets(ticketsData);
        setRevenue(revenueData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="page-container">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="danger">{error}</Alert>
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/events" className="btn btn-outline-primary mb-3">
        &larr; Back to Events
      </Link>

      <Card className="mb-4">
        <Card.Header as="h4">{event.name}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Venue:</strong> {event.venue ? event.venue.name : 'N/A'}</p>
              <p><strong>Location:</strong> {event.venue ? event.venue.location : 'N/A'}</p>
              <p><strong>Description:</strong> {event.description || 'No description available.'}</p>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Header>Revenue Statistics</Card.Header>
                <Card.Body>
                  <h3>${revenue.total_revenue.toFixed(2)}</h3>
                  <p>Tickets Sold: {revenue.tickets_sold}</p>
                  <p>Tickets Available: {revenue.tickets_available}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="tickets" className="mb-4">
        <Tab eventKey="tickets" title="Available Tickets">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ticket Type</th>
                <th>Price</th>
                <th>Available</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {availableTickets.length > 0 ? (
                availableTickets.map((ticket) => (
                  <tr key={ticket.ticket_type_id}>
                    <td>{ticket.name}</td>
                    <td>${ticket.price.toFixed(2)}</td>
                    <td>{ticket.available}</td>
                    <td>{ticket.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No ticket types available for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tab>
        
        <Tab eventKey="bookings" title="Bookings">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Ticket Type</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.confirmation_code}</td>
                    <td>{booking.user_name}</td>
                    <td>{booking.ticket_type_id}</td>
                    <td>{booking.quantity}</td>
                    <td>${booking.total_price.toFixed(2)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{formatDate(booking.booking_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No bookings found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default EventDetails; 