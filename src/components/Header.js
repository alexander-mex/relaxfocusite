import { useNavigate } from "react-router-dom"
import {
  Navbar,
  Container,
  Button,
  Image
} from "react-bootstrap"
import ThemeToggle from "./ThemeToggle"
import * as bootstrap from "bootstrap"
import '../styles/Header.css'

const Header = ({ darkMode, setDarkMode, user, handleLogout }) => {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    handleLogout()
  }

  const handleLoginClick = () => {
    if (
      window.location.pathname.includes("/email-verified") ||
      window.location.pathname.includes("/verify-email")
    ) {
      navigate("/")
      setTimeout(() => {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
      }, 100)
    }
  }

  const handleRegisterClick = () => {
    if (
      window.location.pathname.includes("/email-verified") ||
      window.location.pathname.includes("/verify-email")
    ) {
      navigate("/")
      setTimeout(() => {
        const registerModal = new bootstrap.Modal(document.getElementById("registerModal"))
        registerModal.show()
      }, 100)
    }
  }

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="md"
      className="py-2"
      collapseOnSelect
    >
      <Container fluid>
        <Navbar.Brand as="div">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

          <Navbar.Collapse 
              id="main-navbar-nav" 
              className={darkMode ? "dark-theme" : "light-theme"}
            >
            <div className="d-flex flex-column flex-md-row gap-2 mt-3 mt-md-0">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Button variant="outline-primary" onClick={() => navigate("/admin")}>
                      Edit
                    </Button>
                  )}
                  <div className="d-flex align-items-center me-2">
                    {user.profilePicture && (
                      <Image 
                        src={user.profilePicture} 
                        roundedCircle 
                        width="30" 
                        height="30" 
                        className="me-2"
                        alt="User avatar"
                      />
                    )}
                    <span className="text-nowrap">{user.name}</span>
                  </div>
                  <Button variant="outline-info" onClick={() => navigate("/profile")}>
                    Profile
                  </Button>
                  <Button variant="outline-danger" onClick={handleLogoutClick}>
                    <i className="bi bi-box-arrow-right"></i>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-success"
                    onClick={handleLoginClick}
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleRegisterClick}
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                  >
                    Registration
                  </Button>
                </>
              )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header