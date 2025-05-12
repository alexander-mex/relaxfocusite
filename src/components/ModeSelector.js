import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../styles/ModeSelector.css';

const ModeSelector = ({ onSelectMode }) => {
  const navigate = useNavigate();

  return (
    <div className="mode-selector-content">
      <Card className="text-center border-0 bg-transparent">
        <Card.Body className='card-selector'>
          <Card.Title as="h2" className="mode-selector-title">
            What will you choose?
          </Card.Title>
          <Container fluid className="mt-4 px-0">
            <Row className="g-3 mode-buttons-container">
              <Col xs={12}>
                <Button
                  variant="light"
                  className="mode-button relax"
                  onClick={() => {
                    onSelectMode('relax');
                    navigate('/relax');
                  }}
                >
                  <i className="bi bi-cloud-sun"></i> Relax
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  variant="light"
                  className="mode-button focus"
                  onClick={() => {
                    onSelectMode('focus');
                    navigate('/focus');
                  }}
                >
                  <i className="bi bi-lightbulb"></i> Concentration
                </Button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ModeSelector;
