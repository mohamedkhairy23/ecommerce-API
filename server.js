const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({
  path: "config.env",
});
const morgan = require("morgan");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const categoryRoutes = require("./routes/categoryRoute");
const subcategoryRoutes = require("./routes/subCategoryRoute");

dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subcategoryRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`.yellow.bold);
});

// Handling rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
