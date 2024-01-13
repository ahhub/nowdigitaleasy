const express = require('express');
const router = express.Router();
const passport = require('passport');
const posts = require('../controllers/posts');
const multer = require('multer');
const { isLoggedIn, isAdminOrAuthor } = require('../authMiddleware/middleware');
const asyncWrapper = require('../middleware/async');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + '.jpg');
  },
});

const upload = multer({ storage: storage });

router.route('/post/new').get(isLoggedIn, asyncWrapper(posts.newpost));

router
  .route('/post')
  .get(isLoggedIn, asyncWrapper(posts.getAllPosts))
  .post(isLoggedIn, upload.single('image'), asyncWrapper(posts.createPost));

router
  .route('/post/:post_id')
  .get(isLoggedIn, isAdminOrAuthor, asyncWrapper(posts.getAPost))
  .delete(isLoggedIn, isAdminOrAuthor, asyncWrapper(posts.deletePost))
  .put(
    isLoggedIn,
    isAdminOrAuthor,
    upload.single('image'),
    asyncWrapper(posts.editPost)
  );

router
  .route('/post/:post_id/edit')
  .get(isLoggedIn, isAdminOrAuthor, asyncWrapper(posts.getEditPost));

router.get('/post/image/:imageName', asyncWrapper(posts.imageUrl));

module.exports = router;
