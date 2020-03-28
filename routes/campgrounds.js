const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// ----- index: show all campgrounds -----
router.get('/', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// ------ create: post new campground -----
router.post('/', isLoggedIn, (req, res) => {
  const postCampground = req.body.campground;
  postCampground.author = {
    id: req.user._id,
    username: req.user.username,
  };
  Campground.create(postCampground, (err, newCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// ----- new: add campground form -----
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// ----- show: specific page -----
router.get('/:id', (req, res) => {
  // find specific campground with id
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // show the page
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// edit: show edit form for one campground
router.get('/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

// update campground
router.put('/:id', (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});


module.exports = router;
