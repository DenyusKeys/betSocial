const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment")
module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().populate('user').sort({ createdAt: "desc" }).lean(); //lean removes extra unneeded data. FASTER!
      res.render("feedCurrent.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //Grabs post, populate the user key which references to the user schema. In the model, you can see the ref:"user"
      const post = await Post.findById(req.params.id).populate('user'); //req.params.id grabs the id from the url (:id)
      const comments = await Comment.find({post: req.params.id}).populate('createdBy').sort({ createdAt: "desc" }).lean(); 
      //Populate uses the key you want to connect to another document. *In comments, createdBy has ref: "user"*
      res.render("post.ejs", { post: post, user: req.user, comments: comments, }); //req.user is from the session. 
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Initialize image and cloudinaryId as empty strings
      // These will be used if a file is uploaded
      let image = '';
      let cloudinaryId = '';

      // If a file is uploaded, upload it to Cloudinary
      if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url; 
        cloudinaryId = result.public_id;
      }
      
      // Create a new post in the database with or without an image
      await Post.create({
        title: req.body.title, //title from form input
        image: image,          //Cloudinary url (if any)
        cloudinaryId: cloudinaryId, //cloudinaryID (if any)
        caption: req.body.caption, //caption from form input
        likes: 0,                  //Default likes to 0
        user: req.user.id,         
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 }, //inc comes with mongoDB (increment)
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }); //params from url
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
