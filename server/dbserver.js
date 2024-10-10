require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
console.log(DB_URL);

// Database connection
async function DBConnect() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB at", DB_URL);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { DBConnect };
