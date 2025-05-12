import React from "react"
import { Button, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import NotFoundImage from "../assets/404.png"

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "80vh" }}>
      <img 
        src={NotFoundImage} 
        alt="404 Not Found" 
        style={{ maxWidth: "100%", height: "auto", maxHeight: "300px", marginBottom: "30px" }} 
      />
      <p className="fs-4 text-muted">Сторінку не знайдено</p>
      <Button variant="primary" onClick={handleGoHome}>На головну</Button>
    </Container>
  )
}

export default NotFound
