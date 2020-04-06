const express = require('express');
const Campground = require('../models/campground');
const middleware = require('../middleware');

const router = express.Router();

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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

// update campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// destroy campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds');
    }
    campground.remove();
    res.redirect('/campgrounds');
  });
});

module.exports = router;
