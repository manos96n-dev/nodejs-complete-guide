const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const app = express();

app.set('view engine', 'ejs'); // Compile dynamic templates.
app.set('views', 'views'); // Sets the location of the templates.

app.use(bodyParser.urlencoded({ extended: false })); // Extracts the data from the form when submit.
app.use(express.static(path.join(__dirname, 'public'))); // Sets the public folder for statics files.

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
