const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const seedDB = require('./seeds');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

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
seedDB();


app.get('/', (req, res) => {
  res.render('landing');
});

// ---------------------------------------
//              CAMPGROUNDS ROUTE
// ---------------------------------------
// ----- index: show all campgrounds -----
app.get('/campgrounds', (req, res) => {
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
app.post('/campgrounds', (req, res) => {
  // TODO refactor：修改 new.ejs 的 name 屬性 campground[name] / campground[image]...
  // 讓 post 直接帶 campground 物件來
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
  res.render('campgrounds/new');
});

// ----- show: specific page -----
app.get('/campgrounds/:id', (req, res) => {
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

// -------------------------------------
//            COMMENTS ROUTE
// -------------------------------------
// ----- new: add new comment form -----
app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// ----- create: post new comment to specific campground page -----
app.post('/campgrounds/:id/comments', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          // redirect to campground show page
          res.redirect(`/campgrounds/${foundCampground._id}`);
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('SERVER CONNECTED!');
});
