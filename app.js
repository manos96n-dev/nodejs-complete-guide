const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); // Compile dynamic templates.
app.set('views', 'views'); // Sets the location of the templates.

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false })); // Extracts the data from the form when submit.
app.use(express.static(path.join(__dirname, 'public'))); // Sets the public folder for statics files.

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
