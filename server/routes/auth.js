// server\routes\auth.js
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const { sendVerificationEmail } = require("../services/emailService")

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ message: "Authorization required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey")
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/"
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const userId = req.user.userId
    const fileExt = path.extname(file.originalname)
    cb(null, `profile_${userId}${fileExt}`)
  },
})

const upload = multer({ storage: storage })

router.put("/profile", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    const { email, name } = req.body
    let profilePicture = undefined

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (req.file) {
      if (user.profilePicture) {
        try {
          const oldFilePath = user.profilePicture
          if (oldFilePath !== req.file.path && fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath)
            console.log("Old photo deleted:", oldFilePath)
          }
        } catch (err) {
          console.error("Error deleting old photo:", err)
        }
      }

      profilePicture = req.file.path
      console.log("New photo uploaded:", profilePicture)
    }

    if (email) user.email = email
    if (name !== undefined) user.name = name
    if (profilePicture) user.profilePicture = profilePicture

    await user.save()

    const timestamp = Date.now()
    const profilePictureUrl = user.profilePicture
      ? `${req.protocol}://${req.get("host")}/${user.profilePicture}?t=${timestamp}`
      : undefined

    res.status(200).json({
      email: user.email,
      name: user.name,
      profilePicture: profilePictureUrl,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const userObj = user.toObject()
    delete userObj.__v

    const profilePictureUrl = userObj.profilePicture
      ? `${req.protocol}://${req.get("host")}/${userObj.profilePicture}`
      : null

    res.status(200).json({
      email: userObj.email,
      username: userObj.username,
      name: userObj.name || "",
      profilePicture: profilePictureUrl,
      role: userObj.role,
    })
  } catch (error) {
    console.error("Error getting profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User with this email not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "48h",
    })

    res.status(200).json({ message: "Login successful", token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    // Перевірка надійності пароля
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const baseUsername = email.split("@")[0]
    let username = baseUsername
    let counter = 1

    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`
      counter++
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const emailVerificationToken = crypto.randomBytes(20).toString("hex")

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
      emailVerificationToken,
    })

    await newUser.save()

    try {
      await sendVerificationEmail(email, emailVerificationToken)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
    }

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "48h",
    })

    res.status(201).json({
      message: "Registration successful. Please check your email for verification.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
})

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query

    console.log("Email verification request received with token:", token)

    if (!token) {
      console.log("Token missing in request")
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      })
    }

    const user = await User.findOne({ emailVerificationToken: token })

    if (!user) {
      console.log("User with this token not found:", token)
      return res.status(404).json({
        success: false,
        message: "Invalid verification token or user not found",
      })
    }

    console.log("User found:", user.email)

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    await user.save()

    console.log("Verification status updated for user:", user.email)

    const jwtToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "48h",
    })

    return res.status(200).json({
      success: true,
      message: "Email successfully verified",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error during email verification",
      error: error.message,
    })
  }
})

router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword

    await user.save()
    res.status(200).json({ message: "Password changed successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router