const Comment = require("../models/Comment")

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({ //Use comment model
        commentText: req.body.comment,
        likes: 0,
        postID: req.params.id,//Pull id from url
        commentMadeBy: req.user.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id); //refresh back to post
    } catch (err) {
      console.log(err);
    }
  },
};