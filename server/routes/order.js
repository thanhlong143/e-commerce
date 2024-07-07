const router = require('express').Router();
const ctrls = require('../controllers/orderController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', verifyAccessToken, ctrls.createOrder);

module.exports = router;