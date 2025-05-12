import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Container, Card, Button, Row, Col } from "react-bootstrap"
import { CheckCircleFill } from "react-bootstrap-icons"
import axios from "axios"
import "../styles/EmailConfirmed.css"

const EmailConfirmed = ({ darkMode }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(null)
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying email with token:", token)

        const verifyUrl = (`${process.env.REACT_APP_API_URL}/api/auth/verify-email?token=${token}`)
        console.log("Full request URL:", verifyUrl)

        const response = await axios.get(verifyUrl)
        console.log("Server response:", response.data)

        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token)
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
        }

        setStatus("success")
      } catch (error) {
        console.error("Email verification failed", error)
        console.error("Error details:", error.response?.data || "No additional details")
        setStatus("error")
      }
    }

    if (token) {
      verifyEmail()
    } else {
      const success = searchParams.get("success")
      if (success === "true") {
        setStatus("success")
      } else if (success === "false") {
        setStatus("error")
      }
    }
  }, [token, searchParams])

  const handleGoHome = () => {
    navigate("/")
  }

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/")
      }
    }

    window.addEventListener("storage", checkAuthStatus)

    return () => {
      window.removeEventListener("storage", checkAuthStatus)
    }
  }, [navigate])

  return (
    <div
      className={`email-confirmed-wrapper d-flex align-items-center justify-content-center ${darkMode ? "dark-theme" : "light-theme"}`}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {status === "success" ? (
              <Card className="email-confirmed-card shadow-lg text-center">
                <Card.Body>
                  <CheckCircleFill size={60} color="#28a745" className="mb-3 animate-check" />
                  <Card.Title className="mb-3 fs-3">Email Verified!</Card.Title>
                  <Card.Text className="fs-5">
                    Thank you for verification. You can now use the website.
                  </Card.Text>
                  <Button type="button" variant="success" className="btn-success mt-4 px-4 py-2" onClick={handleGoHome}>
                    Go to Home
                  </Button>
                </Card.Body>
              </Card>
            ) : status === "error" ? (
              <Card className="email-confirmed-card shadow-lg text-center">
                <Card.Body>
                  <CheckCircleFill size={60} color="#dc3545" className="mb-3 animate-check" />
                  <Card.Title className="mb-3 fs-3">Verification Error</Card.Title>
                  <Card.Text className="fs-5">
                    An error occurred during email verification. Please try again.
                  </Card.Text>
                  <Button type="button" variant="danger" className="mt-4 px-4 py-2" onClick={handleGoHome}>
                    Try Again
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card className="email-confirmed-card shadow-lg text-center">
                <Card.Body>
                  <Card.Title className="mb-3 fs-3">Email Verification...</Card.Title>
                  <Card.Text className="fs-5">Please wait...</Card.Text>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EmailConfirmed