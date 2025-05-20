const mongoose = require("mongoose");

// MongoDB bağlantısı
const db = () => {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/yourdbname")
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};

module.exports = db;
