import { Button, Container, Row, Col, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../styles/NotFound.css"
import notFoundImage from "../assets/404.png"

const NotFound = ({ darkMode }) => {
  const navigate = useNavigate()

  return (
    <div className={`not-found-wrapper d-flex align-items-center justify-content-center ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Container className="text-center py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Image
              src={notFoundImage}
              alt="404 Not Found"
              className="img-fluid not-found-image mb-4 animate-fade"
            />
            <h1 className="display-4">Page Not Found</h1>
            <p className="lead mb-4">Oops! The page you're looking for doesn't exist or has been moved.</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Go Back Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NotFound