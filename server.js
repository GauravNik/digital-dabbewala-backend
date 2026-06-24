require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Import DB (this will connect to TiDB)
require("./db");

// Routes
const authRoutes = require("./routes/auth");
const messRoutes = require("./routes/mess");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/mess", messRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Digital Dabbewala Backend Running");
});

// Render Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});