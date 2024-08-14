const router = require("express").Router();
const ctrls = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/register", ctrls.register);
router.post("/mock", ctrls.createUsers);
router.put("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteUsers);
router.put("/current", verifyAccessToken, uploader.single("avatar"), ctrls.updateUser);
router.put("/address", [verifyAccessToken], ctrls.updateUserAddress);
router.put("/cart", [verifyAccessToken], ctrls.updateUserCart);
router.delete("/remove-in-cart/:pid/:color", [verifyAccessToken], ctrls.removeProductInCart);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);

module.exports = router;

// CREATE (POST) + PUT - body
// GET DELETE - query // ?zsdsf&sfdsf