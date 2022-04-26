const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const app = express()
const port = 3000

//connection to database
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database, { 
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ');
});
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});


app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Passport Middleware
app.use(session({ 
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); 

const prediction = require('./routes/prediction');
app.use(prediction);

const users = require('./routes/users');
app.use(users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})