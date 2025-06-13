const Comment = require("../models/Comment")

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({ //Use comment model
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,//Pull id from url
        createdBy: req.user.id
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id); //refresh back to post
    } catch (err) {
      console.log(err);
    }
  },
};