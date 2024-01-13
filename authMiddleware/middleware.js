const Post = require('../models/blog');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('auth Error ⚡');
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAdminOrAuthor = async (req, res, next) => {
  const postId = req.params.post_id;
  let post;
  post = await Post.findById(postId).populate('createdBy').lean();
  if (
    req.user.role === 'admin' ||
    post.createdBy._id.toString() === req.user._id.toString()
  ) {
    next();
  } else {
    req.flash('error', 'user are not authorized');
    res.redirect('/post');
  }
};
