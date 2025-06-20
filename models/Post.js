const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    required: true,
  },
  reasoning: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: false,
  },
  likes: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tracked: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

//Collection gets named to it's plural form "posts"
module.exports = mongoose.model("Post", PostSchema);
