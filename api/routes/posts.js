const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  listPosts,
  updatePost,
  deletePost,
  searchPosts,
  updateLikes,
} = require("../controllers/postsController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/list", listPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/search", searchPosts);
router.patch("/:id/likes", updateLikes);

module.exports = router;
