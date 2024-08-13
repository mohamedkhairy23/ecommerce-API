const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      min: [1, "Product price must be greater than 0"],
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Populate Reviews On Product
productSchema.virtual("reviews", {
  ref: "Review", // refer to reference of review model that exports in key "Review"
  foreignField: "product", // field name that exists in review schema
  localField: "_id", // refer to _id of product
});

// monggose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  this.populate({
    path: "subcategories",
    select: "name",
  });
  this.populate({
    path: "brand",
    select: "name",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
