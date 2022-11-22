const { postSchema, commentSchema } = require("../schemas");
const ExpressError = require("./ExpressErrors");

module.exports.validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 500);
  } else {
    next();
  }
};
module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details[0].message;
    console.log(msg);
    // const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 500);
  } else {
    next();
  }
};
