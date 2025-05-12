"use client"

// src\App.js
import { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "./styles/fonts.css"
import Header from "./components/Header"
import ModeSelector from "./components/ModeSelector"
import Footer from "./components/Footer"
import CanvasAnimation from "./components/CanvasAnimation"
import Modals from "./components/Modals"
import RelaxPage from "./components/RelaxPage"
import FocusPage from "./components/FocusPage"
import ProtectedRoute from "./components/ProtectedRoute"
import ProfileSettings from "./components/ProfileSettings"
import EmailConfirmed from "./components/EmailConfirmed"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import "./styles/modal.css"
import "./styles/styles.css"
import "./styles/theme.css"

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  });

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch (error) {
        console.error("Помилка при розборі даних користувача з localStorage:", error);
        return token ? { token } : null;
      }
    }
    return token ? { token } : null;
  });

  const [loading, setLoading] = useState(true);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedMode, setSelectedMode] = useState(() => {
    return localStorage.getItem("selectedMode") || null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const updateUser = useCallback((userData) => {
    if (userData) {
      setUser(userData)
      localStorage.setItem("userData", JSON.stringify(userData))
      if (userData.token) {
        localStorage.setItem("token", userData.token)
      }
    } else {
      setUser(null)
      localStorage.removeItem("userData")
      localStorage.removeItem("token")
      setShowModeSelector(false)
    }
  }, [])

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : ""

    const style = document.createElement("style")
    style.innerHTML = `
      body.dark-theme {
        background: linear-gradient(to bottom, #121212, #333333);
        color: #f0f0f0;
      }
      body.dark-theme .navbar {
        background: linear-gradient(145deg, #222, #111) !important;
      }
      body.dark-theme .footer {
        background: linear-gradient(145deg, #222, #111) !important;
      }
      body.dark-theme .mode-selector-card {
        background: rgba(40, 40, 40, 0.95);
        color: #f0f0f0;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [darkMode])

  const fetchUserProfile = useCallback(async () => {
    const token = user?.token || localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      setShowModeSelector(false)
      return
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const fullUserData = {
        email: response.data.email,
        username: response.data.username,
        name: response.data.name || "",
        profilePicture: response.data.profilePicture || null,
        role: response.data.role,
        token: token,
      }

      setUser(fullUserData)
      localStorage.setItem("userData", JSON.stringify(fullUserData))
      if (location.pathname === "/") {
        setShowModeSelector(true)
      }
    } catch (error) {
      console.error("Помилка при отриманні профілю:", error)
      setShowModeSelector(false)
    } finally {
      setLoading(false)
    }
  }, [user?.token, location.pathname])

  useEffect(() => {
    if (user && location.pathname === "/") {
      setShowModeSelector(true)
    } else {
      setShowModeSelector(false)
    }
  }, [location.pathname, user])

  useEffect(() => {
    if (loading) {
      fetchUserProfile()
    }
  }, [fetchUserProfile, loading])

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    localStorage.setItem("selectedMode", mode);
    setShowModeSelector(false);
  };

  const handleReturnToModeSelect = () => {
    setSelectedMode(null);
    localStorage.removeItem("selectedMode");
    setShowModeSelector(!!user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedMode");
    setUser(null);
    setSelectedMode(null);
    setShowModeSelector(false);

    navigate("/");

    setTimeout(() => {
      document.body.classList.remove("modal-open");
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
    }, 100);
  };

  if (loading) {
    return <div className="loading-spinner">Завантаження...</div>
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        {/* Показуємо ModeSelector тільки для авторизованих користувачів */}
        {user && showModeSelector && !location.pathname.includes("/profile") && (
          <ModeSelector onSelectMode={handleSelectMode} />
        )}

        <Routes>
          <Route
            path="/profile"
            element={
              user ? (
                <ProfileSettings user={user} setUser={updateUser} darkMode={darkMode} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/relax"
            element={
              <ProtectedRoute isAllowed={selectedMode === "relax"}>
                <RelaxPage onReturnToModeSelect={handleReturnToModeSelect} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute isAllowed={selectedMode === "focus"}>
                <FocusPage onReturnToModeSelect={handleReturnToModeSelect} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              !showModeSelector && selectedMode === "relax" ? (
                <Navigate to="/relax" replace />
              ) : !showModeSelector && selectedMode === "focus" ? (
                <Navigate to="/focus" replace />
              ) : (
                <CanvasAnimation darkMode={darkMode} />
              )
            }
          />
          <Route path="/verify-email" element={<EmailConfirmed darkMode={darkMode} />} />
          <Route path="/email-verified" element={<EmailConfirmed darkMode={darkMode} />} />
        </Routes>
      </main>

      <Footer
        darkMode={darkMode}
        selectedMode={selectedMode}
        user={user}
        showModeSelector={showModeSelector && !!user}
      />

      <Modals setUser={updateUser} fetchUserProfile={fetchUserProfile} />
    </div>
  )
}

export default AppWrapper
