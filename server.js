const express = require("express");
const dotenv = require("dotenv");
dotenv.config({
  path: "config.env",
});

const app = express();

app.get("/", (req, res) => {
  res.send("Our API...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
