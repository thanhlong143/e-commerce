const router = require("express").Router();
const ctrls = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], ctrls.deleteUsers);
router.put("/current", [verifyAccessToken], ctrls.updateUser);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);
router.put("/current/address", [verifyAccessToken], ctrls.updateUserAddress);
router.put("/current/cart", [verifyAccessToken], ctrls.updateUserCart);

module.exports = router;

// CREATE (POST) + PUT - body
// GET DELETE - query // ?zsdsf&sfdsf