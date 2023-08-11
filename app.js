const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express();

app.engine('hbs', expressHbs());
app.set('view engine', 'hbs'); // Compile dynamic templates.
app.set('views', 'views'); // Sets the location of the templates.

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false })); // Extracts the data from the form when submit.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
