const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tagRoutes = require("./routes/tagRoutes");
const accessRoutes = require("./routes/accessRoutes");
const policyRoutes = require("./routes/policyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "NFC Identity API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/policies", policyRoutes);

module.exports = app;