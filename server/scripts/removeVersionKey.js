const mongoose = require("mongoose")
const config = require("../config")

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

async function removeVersionKeyFromAllCollections() {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()

    for (const collection of collections) {
      console.log(`Removing __v from collection: ${collection.name}`)

      await mongoose.connection.db.collection(collection.name).updateMany(
        {},
        { $unset: { __v: "" } },
      )

      console.log(`Successfully removed __v from collection: ${collection.name}`)
    }

    console.log("Successfully removed __v from all collections")
  } catch (error) {
    console.error("Error removing __v:", error)
  } finally {
    await mongoose.connection.close()
    console.log("MongoDB connection closed")
  }
}

removeVersionKeyFromAllCollections()
