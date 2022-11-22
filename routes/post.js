const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { validatePost } = require("../utils/validations");
const post = require("../controllers/post");
const { isLoggedIn } = require("../middleware");

//...................All Posts..................
router.route("/").get(catchAsync(post.index)).post(
  // isLoggedIn,
  validatePost,
  catchAsync(post.createPost)
);
//Renders new form for post
router.get("/new", isLoggedIn, post.renderNewForm);

//Renders Edit form
router.get("/:id/edit", isLoggedIn, post.renderEditForm);
//......................Show campground.................
router
  .route("/:id")
  .get(catchAsync(post.showPost))
  .put(isLoggedIn, validatePost, catchAsync(post.editPost))
  .delete(isLoggedIn, catchAsync(post.deletePost));

module.exports = router;
