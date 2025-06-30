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
      //Populate will cross reference createdBy to the user schema along with other properties specified.
      const posts = await Post.find().populate('createdBy', 'userName wins losses').sort({ createdAt: "desc" }).lean(); //lean removes extra unneeded data. FASTER!
      posts.forEach(post => {
        post.formattedDate = new Date(post.createdAt).toLocaleString("en-US", {
        weekday: "short",   // e.g., "Mon"
        month: "long",      // e.g., "June"
        day: "numeric",     // e.g., "23"
        hour: "numeric",    // e.g., "2"
        minute: "2-digit",  // e.g., "23"
        hour12: true        // 12-hour format with AM/PM
      });
      });
      res.render("feedCurrent.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getSportFeed: async (req, res) => {
    try {
      //Grab sport name from the url /feed/:sport
      const sport = req.params.sport;
      //Format the sport to match DB "Baseball". Capitalize first letter and concantenate the rest of the sport.
      const formattedSport = sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase();

      //Query DB for posts matching the sport.  
      const posts = await Post.find({ sport: formattedSport}).populate('createdBy', 'userName wins losses').sort({ createdAt: "desc" }).lean();
      //Render feed and pass the filtered posts and sport name
      res.render("feedCurrent.ejs", { posts, sport: formattedSport}); 
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //Grabs post, populate the user key which references to the user schema. In the model, you can see the ref:"user"
      const post = await Post.findById(req.params.id).populate('createdBy', 'userName'); //req.params.id grabs the id from the url (:id)
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
      
      const tracked = req.body.tracked === 'true';

      // Create a new post in the database with or without an image
      await Post.create({
        sport: req.body.sport,
        prediction: req.body.prediction,
        reasoning: req.body.reasoning, 
        image: image,          //Cloudinary url (if any)
        cloudinaryId: cloudinaryId, //cloudinaryID (if any)
        likes: 0,                  //Default likes to 0
        createdBy: req.user.id,
        tracked: req.body.tracked         
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
