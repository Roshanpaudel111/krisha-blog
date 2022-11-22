const User = require("../models/user");
module.exports.addUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome!!!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.reqLogin = (req, res) => {
  req.flash("success", "Welcome Back !!");
  res.redirect("/");
};

module.exports.reqLogout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash("success", "Successfully Logged Out!!!");
    res.redirect("/");
  });
};
