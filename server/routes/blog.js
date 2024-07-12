const router = require("express").Router();
const ctrls = require("../controllers/blogController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.put("/blogimage/:bid", [verifyAccessToken, isAdmin], uploader.single("image"), ctrls.uploadBlogImages);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
router.put("/like/:bid", [verifyAccessToken], ctrls.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrls.dislikeBlog);
router.get("/one/:bid", ctrls.getBlog);
router.get("/", ctrls.getBlogs);

module.exports = router;