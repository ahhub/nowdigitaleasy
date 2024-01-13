const fs = require('fs');
const Post = require('../models/blog');
const { createCustomError } = require('../errors/custom-error');

module.exports.getAllPosts = async (req, res, next) => {
  let posts;
  if (req.user.role === 'admin') {
    posts = await Post.find().populate('createdBy').lean();
  } else {
    posts = await Post.find({ createdBy: req.user._id })
      .populate('createdBy')
      .lean();
  }
  const result = posts.map((post) => {
    if (post.image) {
      return { ...post, image: `post/image/${post.image}` };
    } else {
      return post;
    }
  });
  res.render('blog/allPost', { result });
};

module.exports.createPost = async (req, res, next) => {
  const fileName = req.file.filename;
  const createdBy = req.user._id;
  const { title, description, isPrivate = false } = req.body;
  const is_private = JSON.parse(isPrivate);
  await Post.create({
    title,
    description,
    image: fileName,
    isPrivate: is_private,
    createdBy,
  });
  req.flash('success', 'successfully created the post');
  res.redirect('/post');
};

module.exports.imageUrl = async (req, res, next) => {
  const imageName = req.params.imageName;
  res.sendFile(req.rootPath + `/uploads/${imageName}`);
};

module.exports.getAPost = async (req, res, next) => {
  const postId = req.params.post_id;
  let post = await Post.findById(postId).populate('createdBy').lean();
  post = { ...post, image: `image/${post.image}` };
  res.render('blog/post', { post });
};

module.exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.post_id;
    const image_path = req.body.image_path;
    if (image_path) {
      fs.unlinkSync('uploads/' + image_path.split('/')[1]);
    }
    await Post.findByIdAndDelete(postId);
    req.flash('success', 'successfully deleted the post');
    res.redirect('/post');
  } catch (error) {
    return next(createCustomError(error.message.split(',')[0], 404));
  }
};

module.exports.editPost = async (req, res, next) => {
  const body = { ...req.body };
  const postId = req.params.post_id;
  if (req.file) {
    const post = await Post.findById(postId);
    body.image = req.file.filename;
    fs.unlink('uploads/' + post.image, (err) => {
      if (err) throw err;
    });
  }
  await Post.findByIdAndUpdate(postId, body);
  req.flash('success', 'successfully edited the post');
  res.redirect('/post');
};

module.exports.getEditPost = async (req, res, next) => {
  const postId = req.params.post_id;
  const post = await Post.findById(postId);
  res.render('blog/edit', { post });
};

module.exports.newpost = async (req, res, next) => {
  res.render('blog/new');
};
