const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found"
//   });
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});