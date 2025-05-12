const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Правильне розміщення опції versionKey
  },
)

// Налаштування toJSON опції для видалення __v, якщо воно все ще присутнє
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v
    return ret
  },
})

// Налаштування toObject опції для видалення __v, якщо воно все ще присутнє
UserSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model("User", UserSchema)
