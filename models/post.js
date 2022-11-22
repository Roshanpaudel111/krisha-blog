const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      required: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

postSchema.post("findOneAndDelete", async function (document) {
  if (document) {
    await Comment.deleteMany({ _id: { $in: document.comments } });
  }
});

module.exports = mongoose.model("Post", postSchema);
