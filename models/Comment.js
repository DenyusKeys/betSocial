const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  commentMadeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  }],
});

//Collection gets named to it's plural form "posts"
module.exports = mongoose.model("Comment", CommentSchema);
