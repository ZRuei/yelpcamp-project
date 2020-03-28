const mongoose = require('mongoose');
const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// remove the campground with their comments
campgroundSchema.pre('remove', async function () {
  try {
    await Comment.deleteMany({
      _id: {
        $in: this.comments,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);
