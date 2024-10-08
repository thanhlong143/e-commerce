const userRouter = require("./user");
const blogRouter = require("./blog");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const insertRouter = require("./insert");
const { notFound, errorHandler } = require("../middlewares/errorHandlerMiddleware");

const initRoutes = (app) => {
   app.use("/api/user", userRouter);
   app.use("/api/blog", blogRouter);
   app.use("/api/product", productRouter);
   app.use("/api/productcategory", productCategoryRouter);
   app.use("/api/blogcategory", blogCategoryRouter);
   app.use("/api/brand", brandRouter);
   app.use("/api/coupon", couponRouter);
   app.use("/api/order", orderRouter);
   app.use("/api/insert", insertRouter);

   app.use(notFound);
   app.use(errorHandler);
}

module.exports = initRoutes;