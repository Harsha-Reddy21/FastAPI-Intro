import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Table, Alert, Badge } from 'react-bootstrap';
import { getVenue, getVenueEvents, getVenueOccupancy } from '../services/api';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const [venueData, eventsData, occupancyData] = await Promise.all([
          getVenue(id),
          getVenueEvents(id),
          getVenueOccupancy(id)
        ]);
        
        setVenue(venueData);
        setEvents(eventsData);
        setOccupancy(occupancyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venue data:', error);
        setError('Failed to load venue details. Please try again later.');
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="page-container">Loading venue details...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="danger">{error}</Alert>
        <Link to="/venues" className="btn btn-primary">
          Back to Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/venues" className="btn btn-outline-primary mb-3">
        &larr; Back to Venues
      </Link>

      <Card className="mb-4">
        <Card.Header as="h4">{venue.name}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p><strong>Location:</strong> {venue.location}</p>
              <p><strong>Capacity:</strong> {venue.capacity} people</p>
              <p><strong>Description:</strong> {venue.description || 'No description available.'}</p>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Header>Occupancy Statistics</Card.Header>
                <Card.Body>
                  <h3>{occupancy.occupancy_rate.toFixed(1)}%</h3>
                  <p>Total Bookings: {occupancy.total_bookings}</p>
                  <p>Capacity: {occupancy.capacity}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header as="h5">Events at this Venue</Card.Header>
        <Card.Body>
          {events.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  const isPast = eventDate < new Date();
                  
                  return (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td>{formatDate(event.date)}</td>
                      <td>
                        {isPast ? (
                          <Badge bg="secondary">Past</Badge>
                        ) : (
                          <Badge bg="success">Upcoming</Badge>
                        )}
                      </td>
                      <td>
                        <Link to={`/events/${event.id}`} className="btn btn-sm btn-primary">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No events scheduled at this venue.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default VenueDetails; 