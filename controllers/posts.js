const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment")
const User = require("../models/User")
module.exports = {
  getProfile: async (req, res) => {
    try {
      //Fetch all Post where the createdBy field matches the logged-in user's id(req.user.id).
      //.populate fills the fields of each post with the full user object.  Can now use post.createdBy.userName in ejs
      const posts = await Post.find({ createdBy: req.user.id }).populate('createdBy').sort({ createdAt: "desc" }).lean();
      //Passes the posts variable to ejs.  req.user is current logged in user provided by Passport.js
      res.render("profile.ejs", { posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // GET: Another user's public profile by ID
getUserProfile: async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch the user info from DB
    const userInfo = await User.findById(userId).lean();
    
    if (!userInfo) {
      return res.status(404).send("User not found");
    }

    // Fetch user's posts
    const posts = await Post.find({ createdBy: userId }).populate('createdBy', 'userName wins losses').sort({ createdAt: "desc" }).lean();

    //Check if user is viewing another user or themself.
    if (req.user._id.toString() === userId) {
      // If same user, render the logged-in user's profile page
      return res.render("profile.ejs", { posts, user: userInfo });
    }
    
    //Render the user's profile
    res.render("viewUserProfile.ejs", {posts, user: userInfo});
  } 
  catch (err) {
    console.error(err);
    res.status(500).send("Error loading user profile");
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
      //Format the date from DB
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
      //Render feed and pass the filtered posts and sport name
      res.render("feedCurrent.ejs", { posts, sport: formattedSport}); 
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //Grabs post, populate the user key which references to the user schema. In the model, you can see the ref:"user"
      const post = await Post.findById(req.params.id).populate('createdBy', 'userName wins losses'); //req.params.id grabs the id from the url (:id)
      // Format the date
      post.formattedDate = new Date(post.createdAt).toLocaleString("en-US", {
        weekday: "short",   // e.g., "Mon"
        month: "long",      // e.g., "June"
        day: "numeric",     // e.g., "23"
        hour: "numeric",    // e.g., "2"
        minute: "2-digit",  // e.g., "23"
        hour12: true        // 12-hour format with AM/PM
      });
      
      const comments = await Comment.find({postID: req.params.id}).populate('commentMadeBy', 'userName').sort({ createdAt: "desc" }).lean(); 
      //Use formattedDate in EJS
      comments.forEach(comment => {
        comment.formattedDate = new Date(comment.createdAt).toLocaleString("en-US", {
        weekday: "short",   // e.g., "Mon"
        month: "long",      // e.g., "June"
        day: "numeric",     // e.g., "23"
        hour: "numeric",    // e.g., "2"
        minute: "2-digit",  // e.g., "23"
        hour12: true        // 12-hour format with AM/PM
        });
      });

      //Populate uses the key you want to connect to another document. *In comments, createdBy has ref: "user"*
      res.render("viewPost.ejs", { post, user: req.user, comments }); //req.user is from the session. 
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
