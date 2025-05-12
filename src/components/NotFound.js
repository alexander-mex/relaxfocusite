import React from "react"
import { Button, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import NotFoundImage from "../assets/404.png"
import "../styles/NotFound.css"

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <Container className="notfound-wrapper d-flex flex-column justify-content-center align-items-center text-center">
      <img 
        src={NotFoundImage} 
        alt="404 Not Found" 
        className="notfound-img mb-4"
      />
      <h2 className="text-muted mb-3">Oops! This page was not found...</h2>
      <Button variant="primary" className="go-home-btn px-4 py-2" onClick={handleGoHome}>
        Back To Home
      </Button>
    </Container>
  )
}

export default NotFound