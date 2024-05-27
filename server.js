const express = require("express");
const dotenv = require("dotenv");
dotenv.config({
  path: "config.env",
});
const morgan = require("morgan");
const dbConnection = require("./config/database");
const colors = require("colors");
const categoryRoutes = require("./routes/categoryRoute");

// Connect with db
dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/categories", categoryRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`.yellow.bold);
});
