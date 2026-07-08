require("dotenv").config();

const connectDB = require("./config/database/connect");
const authRoutes = require("./config/database/middleware/models/routes/auth");

const express = require("express");
const cors = require("cors");
const { apiLimiter, authLimiter } = require("./config/database/middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter); // Apply rate limiting to all routes

app.get("/", (req, res) => {
    res.send("Fortnite Backend is running!");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "online", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongoStatus: "connected"
    });
});

const playerRoutes = require("./config/database/middleware/models/routes/player");
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/player", playerRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found." });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
