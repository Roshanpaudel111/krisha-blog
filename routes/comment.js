const express = require("express");
router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/CatchAsync");
const { validateComment } = require("../utils/validations");
const { isLoggedIn } = require("../middleware");
const comment = require("../controllers/comment");
//....................Commnt Route......................
//....................Creating Comment.......................
// router.post("/", validateComment, catchAsync(comment.createComment));
router.post("/", validateComment, catchAsync(comment.createComment));
//..................Deleting Comment......................................

router.delete("/:commentId", isLoggedIn, catchAsync(comment.deleteComment));

module.exports = router;
