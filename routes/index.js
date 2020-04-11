const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();


// ----- landing page -----
router.get('/', (req, res) => {
  res.render('landing');
});

// ----- show register form -----
router.get('/register', (req, res) => {
  res.render('auth/register');
});
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('errorMsg', err.message);
      return res.render('auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('successMsg', `Welcome to YelpCamp ${user.username}`);
      res.redirect('/campgrounds');
    });
  });
});

// ----- show login form -----
router.get('/login', (req, res) => {
  res.render('auth/login');
});
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }));

// ----- logout -----
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('successMsg', 'Logged you out!');
  res.redirect('/campgrounds');
});

module.exports = router;
