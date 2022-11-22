const Joi = require("joi");

module.exports.postSchema = Joi.object({
  post: Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    blog: Joi.string().required(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    body: Joi.string().required(),
  }).required(),
});
