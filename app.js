const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.sg2hi.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs'); // Compile dynamic templates.
app.set('views', 'views'); // Sets the location of the templates.

app.use(bodyParser.urlencoded({ extended: false })); // Extracts the data from the form when submit.

// Initializies multer to allows us the extraction of the image file from the form.
app.use(
  multer({
    dest: 'images',
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single('image')
);

app.use(express.static(path.join(__dirname, 'public'))); // Sets the public folder for statics files.
app.use('/images', express.static(path.join(__dirname, 'images'))); // Sets the images folder for statics files.

// Initialize a session middleware
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((err, req, res, next) => {
  // res.redirect('/500');
  console.log(err);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
