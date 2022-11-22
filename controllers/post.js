const Post = require("../models/post");
const createDomPurify = require("dompurify");
const marked = require("marked");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

module.exports.index = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: "desc" });
  res.render("posts/index", { posts });
};
module.exports.renderNewForm = (req, res) => {
  res.render("posts/new");
};
module.exports.createPost = async (req, res, next) => {
  const post = new Post(req.body.post);
  post.sanitizedHtml = await dompurify.sanitize(marked.parse(post.blog));
  await post.save();
  req.flash("success", "Successfully created a blog !!!");
  res.redirect(`posts/${post._id}`);
};
module.exports.showPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");
  if (!post) {
    req.flash("error", "Opps cannot find the blog!!");
    return res.redirect("/posts");
  }
  res.render("posts/show", { post });
};
module.exports.editPost = async (req, res) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  const newSanitizedHtml = await dompurify.sanitize(
    marked.parse(req.body.post.blog)
  );
  const updatePost = {
    $set: {
      title: req.body.post.title,
      subtitle: req.body.post.subtitle,
      description: req.body.post.description,
      blog: req.body.post.blog,
      sanitizedHtml: newSanitizedHtml,
    },
  };
  await Post.findByIdAndUpdate(id, updatePost);
  req.flash("success", "Successfully Updated Blog !!!");
  res.redirect(`/posts/${post._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    req.flash("error", "Opps cannot find the blog!!");
    return res.redirect("/posts");
  }
  res.render("posts/edit", { post });
};
module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the blog !!");
  res.redirect("/posts");
};
