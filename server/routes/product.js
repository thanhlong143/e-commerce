const router = require("express").Router();
const ctrls = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], uploader.fields([
   { name: "images", maxCount: 10 },
   { name: "thumb", maxCount: 1 },
]), ctrls.createProduct);
router.get("/", ctrls.getProducts);
router.put("/ratings", [verifyAccessToken], ctrls.ratings);
router.put("/uploadimage/:pid", [verifyAccessToken, isAdmin], uploader.array("images", 10), ctrls.uploadProductImages);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;