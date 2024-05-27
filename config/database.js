const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(
        `Database connected: ${conn.connection.host}`.cyan.underline.bold
      );
    })
    .catch((err) => {
      console.error(`Database error: ${err}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
