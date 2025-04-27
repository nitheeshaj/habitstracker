const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration options
const swaggerOptions = {
    definition: {
        openapi: "3.0.0", // OpenAPI version
        info: {
            title: "User & Habit API",
            version: "1.0.0",
            description: "API documentation for User and Habit Management",
        },
        servers: [
            {
                url: "http://localhost:3000/api", // Corrected the base URL
                description: "Local development server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Allows multiple route files
};

// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Function to set up Swagger in Express app
const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger UI available at: http://localhost:3000/api-docs");
};

module.exports = swaggerDocs;
