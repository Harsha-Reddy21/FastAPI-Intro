import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Form, Row, Col, Modal, Alert, Badge } from 'react-bootstrap';
import { getBookings, createBooking, updateBookingStatus, deleteBooking, getEvents, getTicketTypes } from '../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    quantity: 1,
    event_id: '',
    ticket_type_id: ''
  });

  // Search state
  const [searchParams, setSearchParams] = useState({
    event: '',
    venue: '',
    ticket_type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, eventsData, ticketTypesData] = await Promise.all([
          getBookings(),
          getEvents(),
          getTicketTypes()
        ]);
        setBookings(bookingsData);
        setEvents(eventsData);
        setTicketTypes(ticketTypesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If event selection changes, filter ticket types for that event
    if (name === 'event_id') {
      const eventId = parseInt(value);
      const filteredTicketTypes = ticketTypes.filter(
        (ticketType) => ticketType.event_id === eventId
      );
      setEventTicketTypes(filteredTicketTypes);
      setSelectedEvent(eventId);
      
      // Reset ticket type selection
      setFormData(prev => ({
        ...prev,
        ticket_type_id: ''
      }));
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBooking = await createBooking(formData);
      setBookings([...bookings, newBooking]);
      setShowModal(false);
      setFormData({
        user_name: '',
        user_email: '',
        quantity: 1,
        event_id: '',
        ticket_type_id: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? updatedBooking : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status. Please try again.');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
        setError('Failed to cancel booking. Please try again.');
      }
    }
  };

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
    return <div className="page-container">Loading bookings...</div>;
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Bookings</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Booking
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>Search Bookings</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="event"
                    value={searchParams.event}
                    onChange={handleSearchChange}
                    placeholder="Search by event name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    value={searchParams.venue}
                    onChange={handleSearchChange}
                    placeholder="Search by venue name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Ticket Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="ticket_type"
                    value={searchParams.ticket_type}
                    onChange={handleSearchChange}
                    placeholder="Search by ticket type"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Event</th>
            <th>Ticket Type</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Booking Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.confirmation_code}</td>
                <td>{booking.user_name}</td>
                <td>{booking.event_id}</td>
                <td>{booking.ticket_type_id}</td>
                <td>{booking.quantity}</td>
                <td>${booking.total_price.toFixed(2)}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>{formatDate(booking.booking_date)}</td>
                <td>
                  <div className="d-flex">
                    {booking.status !== 'confirmed' && (
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(booking.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Create Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Event</Form.Label>
              <Form.Select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ticket Type</Form.Label>
              <Form.Select
                name="ticket_type_id"
                value={formData.ticket_type_id}
                onChange={handleInputChange}
                disabled={!selectedEvent}
                required
              >
                <option value="">Select a ticket type</option>
                {eventTicketTypes.map((ticketType) => (
                  <option key={ticketType.id} value={ticketType.id}>
                    {ticketType.name} - ${ticketType.price.toFixed(2)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Booking
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Bookings; 