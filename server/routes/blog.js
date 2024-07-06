const router = require('express').Router();
const ctrls = require('../controllers/blogController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getBlogs);
router.get('/one/:bid', ctrls.getBlog);
router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog);
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog);
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog);
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog);

module.exports = router;