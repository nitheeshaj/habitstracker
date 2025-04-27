require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const swaggerDocs = require("./config/swaggerConfig"); // Import Swagger config
const habitRoutes = require("./routes/habitsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api", userRoutes);
app.use("/api", habitRoutes);

// Initialize Swagger
swaggerDocs(app);

const PORT = process.env.DB_PORT || 5000;

app.listen(PORT,'0.0.0.0',async () => {
    try {
        await sequelize.sync(); // Sync database
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
});
app.get('/', (req, res) => {
    res.send('Hello from Railway!');
    });

module.exports = app;
