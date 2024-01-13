const User = require('./user');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  description: String,
  image: String,
  isPrivate: Boolean,
  date: { type: Date, default: Date.now() },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

BlogSchema.post('save', async function (docs, next) {
  const user = await User.findById(this.createdBy);
  user.posts.push(this._id);
  await user.save();
  next();
});


module.exports = mongoose.model('Blog', BlogSchema);
