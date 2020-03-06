const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const app = express();

dotenv.config();
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('CONNECTED TO DB!');
  }).catch((err) => {
    console.log('ERROR: ', err.message);
  });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


// schema setup

app.get('/', (req, res) => {
  res.render('landing');
});

// ----- index: show all campgrounds -----
app.get('/campgrounds', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: allCampgrounds });
    }
  });
});

// ------ create: post new campground -----
app.post('/campgrounds', (req, res) => {
  const { name, image, description } = req.body;
  const newCampgroundData = { name, image, description };
  Campground.create(newCampgroundData, (err, newCampground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Newly created campground: ${newCampground}`);
      res.redirect('/campgrounds');
    }
  });
});

// ----- new: add campground form -----
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// ----- show: specific page -----
app.get('/campgrounds/:id', (req, res) => {
  // find specific campground with id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // show the page
      res.render('show', { campground: foundCampground });
    }
  });
});


app.listen(3000, () => {
  console.log('SERVER CONNECTED!');
});
