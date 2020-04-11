const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('errorMsg', 'Please login first!');
  return res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // log in or not?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash('errorMsg', 'Campground not found!');
        res.redirect('back');
      // dose user own the campground?
      } else if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('errorMsg', 'You don\'t have permission to do that!');
        res.redirect('back');
      }
    });
  } else {
    req.flash('errorMsg', '請登入以執行後續操作');
    res.redirect('/login');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // log in or not?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('errorMsg', 'Comment not found');
        res.redirect('back');
      // dose user own the comment?
      } else if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('errorMsg', 'You don\'t have permission to do that!');
        res.redirect('back');
      }
    });
  } else {
    req.flash('errorMsg', '請登入以執行後續操作');
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
