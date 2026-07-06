require("dotenv").config();

const connectDB = require("./config/database/connect");
const authRoutes = require("./config/database/middleware/models/routes/auth");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Fortnite Backend is running!");
});

const playerRoutes = require("./config/database/middleware/models/routes/player");
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
