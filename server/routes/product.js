const router = require('express').Router();
const ctrls = require('../controllers/productController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloudinary.config');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadProductImages);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.put('/ratings', verifyAccessToken, ctrls.ratings);
router.get('/:pid', ctrls.getProduct);
router.get('/', ctrls.getProducts);

module.exports = router;