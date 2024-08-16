const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
