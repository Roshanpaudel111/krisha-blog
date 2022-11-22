const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  post.comments.push(comment);
  await comment.save();
  await post.save();
  req.flash("success", "Successuflly added a comment!!");
  res.redirect(`/posts/${post._id}`);
};
module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Deleted the Comment !!!");
  res.redirect(`/posts/${id}`);
};
