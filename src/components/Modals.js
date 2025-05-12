import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/modal.css"

const Modals = ({ setUser, fetchUserProfile }) => {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Initialize Bootstrap modals
  useEffect(() => {
    const loadBootstrap = async () => {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        if (!window.bootstrap) {
          try {
            const bootstrap = await import("bootstrap")
            window.bootstrap = bootstrap
          } catch (error) {
            console.error("Error loading bootstrap:", error)
          }
        }
      }
    }

    loadBootstrap()
  }, [])

  useEffect(() => {
    const successModalElement = document.getElementById("successModal")

    if (successModalElement) {
      const handleHidden = () => {
        document.body.classList.remove("modal-open")
        const backdrops = document.querySelectorAll(".modal-backdrop")
        backdrops.forEach((backdrop) => backdrop.remove())

        // Clear fields after registration
        setRegisterEmail("")
        setRegisterPassword("")
        setConfirmPassword("")
        setRegisterError("")
      }

      successModalElement.addEventListener("hidden.bs.modal", handleHidden)

      return () => {
        successModalElement.removeEventListener("hidden.bs.modal", handleHidden)
      }
    }
  }, [])

  useEffect(() => {
    const loginModal = document.getElementById("loginModal")
    const registerModal = document.getElementById("registerModal")

    const clearErrors = () => {
      setLoginError("")
      setRegisterError("")
    }

    const clearFields = () => {
      setLoginEmail("")
      setLoginPassword("")
      setRegisterEmail("")
      setRegisterPassword("")
      setConfirmPassword("")
    }

    const handleHidden = () => {
      clearErrors()
      clearFields()

      document.body.classList.remove("modal-open")
      const backdrops = document.querySelectorAll(".modal-backdrop")
      backdrops.forEach((backdrop) => backdrop.remove())
    }

    loginModal?.addEventListener("show.bs.modal", clearErrors)
    registerModal?.addEventListener("show.bs.modal", clearErrors)

    loginModal?.addEventListener("hidden.bs.modal", handleHidden)
    registerModal?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      loginModal?.removeEventListener("show.bs.modal", clearErrors)
      registerModal?.removeEventListener("show.bs.modal", clearErrors)

      loginModal?.removeEventListener("hidden.bs.modal", handleHidden)
      registerModal?.removeEventListener("hidden.bs.modal", handleHidden)
    }
  }, [])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)

        const loginModalElement = document.getElementById("loginModal")
        if (loginModalElement) {
          const loginModal = window.bootstrap?.Modal.getInstance(loginModalElement)
          if (loginModal) {
            loginModal.hide()
          }
        }

        document.body.classList.remove("modal-open")
        const backdrops = document.querySelectorAll(".modal-backdrop")
        backdrops.forEach((backdrop) => backdrop.remove())

        if (fetchUserProfile) {
          await fetchUserProfile()
        }

        window.location.reload()
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError(error.response?.data?.message || "An error occurred during login")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    setIsRegistering(true)
    setRegisterError("")

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        email: registerEmail,
        password: registerPassword,
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        setUser({
          email: response.data.user.email,
          username: response.data.user.username,
          role: "user",
          token: response.data.token,
        })

        const registerModalElement = document.getElementById("registerModal")
        if (registerModalElement) {
          const registerModal = window.bootstrap?.Modal.getInstance(registerModalElement)
          if (registerModal) {
            registerModal.hide()
          }
        }

        document.body.classList.remove("modal-open")
        const backdrops = document.querySelectorAll(".modal-backdrop")
        backdrops.forEach((backdrop) => backdrop.remove())

        setTimeout(() => {
          const successModalElement = document.getElementById("successModal")
          if (successModalElement) {
            const successModal = new window.bootstrap.Modal(successModalElement)
            successModal.show()
          }
        }, 100)
      }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during registration"
      setRegisterError(errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <>
      {/* Login Modal */}
      <div
        className="modal fade glass-modal"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog glass-modal-dialog">
          <div className="modal-content glass-modal-content">
            <div className="modal-header glass-modal-header">
              <h5 className="modal-title glass-modal-title" id="loginModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="btn-close glass-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body glass-modal-body">
              {loginError && <div className="alert alert-danger">{loginError}</div>}
              <form className="glass-modal-form" onSubmit={handleLoginSubmit}>
                <div className="mb-3 glass-form-group">
                  <label htmlFor="loginEmail" className="form-label glass-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control glass-form-control"
                    id="loginEmail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 glass-form-group">
                  <label htmlFor="loginPassword" className="form-label glass-form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control glass-form-control"
                    id="loginPassword"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary glass-modal-btn" disabled={isLoggingIn}>
                  {isLoggingIn ? "Loading..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <div
        className="modal fade glass-modal"
        id="registerModal"
        tabIndex="-1"
        aria-labelledby="registerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog glass-modal-dialog">
          <div className="modal-content glass-modal-content">
            <div className="modal-header glass-modal-header">
              <h5 className="modal-title glass-modal-title" id="registerModalLabel">
                Register
              </h5>
              <button
                type="button"
                className="btn-close glass-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body glass-modal-body">
              {registerError && <div className="alert alert-danger">{registerError}</div>}
              <form className="glass-modal-form" onSubmit={handleRegisterSubmit}>
                <div className="mb-3 glass-form-group">
                  <label htmlFor="registerEmail" className="form-label glass-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control glass-form-control"
                    id="registerEmail"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 glass-form-group">
                  <label htmlFor="registerPassword" className="form-label glass-form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control glass-form-control"
                    id="registerPassword"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 glass-form-group">
                  <label htmlFor="confirmPassword" className="form-label glass-form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control glass-form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary glass-modal-btn" disabled={isRegistering}>
                  {isRegistering ? "Loading..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <div
        className="modal fade glass-modal"
        id="successModal"
        tabIndex="-1"
        aria-labelledby="successModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog glass-modal-dialog">
          <div className="modal-content glass-modal-content">
            <div className="modal-header glass-modal-header">
              <h5 className="modal-title glass-modal-title" id="successModalLabel">
                Registration Successful
              </h5>
              <button
                type="button"
                className="btn-close glass-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body glass-modal-body text-center">
              <p className="mb-0">You have successfully registered! Please verify your email to continue using the site.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Mismatch Modal */}
      <div
        className="modal fade glass-modal"
        id="passwordMismatchModal"
        tabIndex="-1"
        aria-labelledby="passwordMismatchModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog glass-modal-dialog">
          <div className="modal-content glass-modal-content">
            <div className="modal-header glass-modal-header">
              <h5 className="modal-title glass-modal-title" id="passwordMismatchModalLabel">
                Error
              </h5>
              <button
                type="button"
                className="btn-close glass-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body glass-modal-body text-center">
              <p className="mb-0">Passwords do not match. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modals