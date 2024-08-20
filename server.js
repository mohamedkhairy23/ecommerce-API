const path = require("path");

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

dotenv.config({
  path: "config.env",
});
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/orderService");

dbConnection();

const app = express();

app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

app.post(
  "/api/v1/orders/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//////////////////////// Code Between For Security ///////////////////////////////////////////////
// Prevent NoSQL Query Injection & Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross site scripting attacks (XSS attacks)
app.use(xss());

// Rate Limiting (limit each IP to 100 requests per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests
  message: "Too many a",
});
app.use("/api", limiter);

// Prevent HTTP parameter pollution (hpp)
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
//////////////////////// Code Between For Security ///////////////////////////////////////////////

app.get("/health", async (req, res) => {
  res.send({ message: "health OK!" });
});

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`.yellow.bold);
});

// Handling rejection errors outside express (Like that errors coming from database in rejection case)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
