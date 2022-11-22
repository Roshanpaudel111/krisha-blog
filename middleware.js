const Post = require("./models/post");
const Comment = require("./models/comment");

//Checks if the admin is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first");
    return res.redirect(`/admin/login`);
  }
  next();
};
