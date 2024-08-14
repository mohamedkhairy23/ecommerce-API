const categoryRoutes = require("./categoryRoute");
const subcategoryRoutes = require("./subCategoryRoute");
const brandRoutes = require("./brandRoute");
const productRoutes = require("./productRoute");
const userRoutes = require("./userRoute");
const authRoutes = require("./authRoute");
const reviewRoutes = require("./reviewRoute");
const wishlistRoutes = require("./wishlistRoute");
const addressesRoutes = require("./addressesRoute");
const couponRoutes = require("./couponRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subcategories", subcategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/addresses", addressesRoutes);
  app.use("/api/v1/coupons", couponRoutes);
};

module.exports = mountRoutes;