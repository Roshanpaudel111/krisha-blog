const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const Post = require("./models/post");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const CatchAsync = require("./utils/CatchAsync");
const { MONGO_URI } = require("./secret");

//Mongodb Connection
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!"));
db.once("open", () => {
  console.log("Connection Open!!");
});

//All app settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// all Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));

const sessionConfig = {
  secret: "This is actual secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//All Routes
app.use("/admin", authRoute);
app.use("/posts", postRoute);
app.use("/posts/:id/comments", commentRoute);

// app.use("/campgrounds/:id/reviews", reviewsRoute);

//...................Home page...................
app.get(
  "/",
  CatchAsync(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: "desc" }).limit(3);
    res.render("home", { posts });
  })
);

//...................About Me page...................
app.get("/about", (req, res) => {
  res.render("about");
});

//...............For all routes that doesn't exists...........................
app.all("*", (req, res, next) => {
  req.flash("error", "Sorry page not found!!!");
  res.redirect("/");
  // err = new ExpressError("Page not found", 404);
  // next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  const { message = "something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});
// export 'app'
app.listen(3000, function () {
  console.log("listening to port 3000");
});
module.exports = app;
