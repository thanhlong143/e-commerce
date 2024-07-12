const router = require("express").Router();
const ctrls = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.put("/status/:oid", verifyAccessToken, isAdmin, ctrls.updateStatus);
router.get("/", verifyAccessToken, ctrls.getUserOrders);
router.get("/admin", verifyAccessToken, isAdmin, ctrls.getOrders);

module.exports = router;