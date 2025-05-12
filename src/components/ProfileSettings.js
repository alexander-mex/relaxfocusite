import { useState, useEffect } from "react"
import axios from "axios"
import { Form, Button, Card, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../styles/ProfileSettings.css"

const ProfileSettings = ({ user, setUser, darkMode }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState(user?.email || "")
  const [name, setName] = useState(user?.name || "")
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState(user?.profilePicture || null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileAlert, setProfileAlert] = useState({
    show: false,
    fading: false,
  })
  const [passwordAlert, setPasswordAlert] = useState({
    show: false,
    fading: false,
  })
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePicture)
      console.log("Set preview from user.profilePicture:", user.profilePicture)
    }
  }, [user?.profilePicture])

  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
      setName((prevName) => prevName || user.name || user.username || "")
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    if (name) formData.append("name", name)

    if (profilePicture) {
      formData.append("profilePicture", profilePicture)
      console.log("Added new photo to formData:", profilePicture.name)
    }

    try {
      console.log("Sending profile update request...")
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setProfileAlert({ show: true, fading: false })

      setTimeout(() => {
        setProfileAlert((prev) => ({ ...prev, fading: true }))
      }, 1500)

      setTimeout(() => {
        setProfileAlert({ show: false, fading: false })
      }, 2000)

      console.log("Received server response:", data)

      setTimestamp(Date.now())

      const updatedUser = {
        ...user,
        email: data.email || user.email,
        name: data.name || user.name,
        profilePicture: data.profilePicture || user.profilePicture,
      }

      console.log("Updated user object:", updatedUser)
      setUser(updatedUser)

      if (profilePicture) {
        const localPreview = URL.createObjectURL(profilePicture)
        setPreview(localPreview)
      } else if (data.profilePicture) {
        setPreview(`${data.profilePicture}?t=${timestamp}`)
      }

      setProfilePicture(null)

      const fileInput = document.getElementById("profile-picture-input")
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error.response?.data?.message || "Profile update error.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      setPasswordAlert({ show: true, fading: false })

      setTimeout(() => {
        setPasswordAlert((prev) => ({ ...prev, fading: true }))
      }, 1500)

      setTimeout(() => {
        setPasswordAlert({ show: false, fading: false })
      }, 2000)

      setCurrentPassword("")
      setNewPassword("")
    } catch (error) {
      console.error("Password change error:", error)
      setError(error.response?.data?.message || "Password change error.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("Selected new file:", file.name)
      setProfilePicture(file)
      const previewUrl = URL.createObjectURL(file)
      console.log("Created preview URL:", previewUrl)
      setPreview(previewUrl)
    }
  }

  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith("blob:")) return url

    if (url.includes("?")) {
      return `${url}&t=${timestamp}`
    }

    return `${url}?t=${timestamp}`
  }

  if (!user) {
    navigate("/")
    return null
  }

  return (
    <div className={`profile-wrapper ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Card className="profile-card glass" style={{ maxHeight: '90vh', padding: '50px' }}>
        <div className="profile-content">
          <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Profile Settings</h2>
          
          {error && <div className="alert alert-danger mb-2 py-1">{error}</div>}
  
          {profileAlert.show && (
            <div className={`alert alert-success mb-2 py-1 ${profileAlert.fading ? "fade-out" : "fade-in"}`}>
              Profile updated successfully!
            </div>
          )}
  
          {passwordAlert.show && (
            <div className={`alert alert-success mb-2 py-1 ${passwordAlert.fading ? "fade-out" : "fade-in"}`}>
              Password changed successfully!
            </div>
          )}
  
          <div className="text-center mb-2">
            <div className="rounded-circle shadow overflow-hidden mx-auto" style={{ width: "100px", height: "100px" }}>
              {preview ? (
                <img
                  src={
                    preview.startsWith("blob:")
                      ? preview
                      : preview.includes("http")
                        ? getImageUrl(preview)
                        : getImageUrl(`${process.env.REACT_APP_API_URL}/${preview}`)
                  }
                  alt="Avatar"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    console.error("Image loading error:", e);
                    e.target.onerror = null;
                    e.target.src = "";
  
                    const imgContainer = e.target.parentNode;
                    if (imgContainer) {
                      const fallback = document.createElement("div");
                      fallback.className =
                        "w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white";
                      fallback.style.fontSize = "35px";
                      fallback.textContent =
                        name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U";
  
                      imgContainer.innerHTML = "";
                      imgContainer.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div
                  className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{ fontSize: "35px" }}
                >
                  {name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
  
          <div className="scrollable-content" style={{ maxHeight: '60vh' }}>
            <Form onSubmit={handleProfileUpdate} className="animated-form mb-2">
              <Form.Group className="mb-2 text-center">
                <Form.Label className="mb-9">Profile Photo</Form.Label>
                <Form.Control 
                  id="profile-picture-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="py-1"
                />
                {profilePicture && (
                  <small className="text-success d-block mt-1" style={{ fontSize: '0.8rem' }}>Selected file: {profilePicture.name}</small>
                )}
              </Form.Group>
  
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="py-1"
                />
              </Form.Group>
  
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Name (optional)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Name"
                  className="py-1"
                />
              </Form.Group>
  
              <div className="text-center mt-2">
                <Button type="submit" className="glow-button m-2 py-1" disabled={loading} style={{ fontSize: '0.9rem' }}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Update Profile"}
                </Button>
              </div>
            </Form>
  
            <hr className="my-2" />
  
            <h4 className="text-center mb-2" style={{ fontSize: '1.2rem' }}>Change Password</h4>
            <Form onSubmit={handlePasswordChange} className="animated-form">
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="py-1"
                />
              </Form.Group>
  
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="py-1"
                />
              </Form.Group>
  
              <div className="text-center mt-2">
                <Button 
                  type="submit" 
                  className="glow-button btn_change_pass mt-2 mb-3 py-1" 
                  disabled={loading}
                  style={{ fontSize: '0.9rem' }}
                >
                  {loading ? <Spinner size="sm" animation="border" /> : "Change Password"}
                </Button>
              </div>
            </Form>
          </div>
  
          <div className="d-flex justify-content-center mt-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-back btn-outline-secondary py-1"
              style={{ fontSize: '0.9rem', width: '50%' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfileSettings