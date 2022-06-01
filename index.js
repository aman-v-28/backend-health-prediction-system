const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express()
const port = process.env.PORT || 3000

//connection to database
const mongoose = require('mongoose');
// const config = require('./config/database');

mongoose.connect(process.env.MONGODB_URL, { 
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
// app.use(session({
//   cookie:{
//     secure: true,
//     maxAge:60000
//   },
//   store: new RedisStore(),   
//   resave: false,
//   saveUninitialized: true,
//   secret: 'SECRET' 
// }));
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL
  })
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); 

const prediction = require('./routes/prediction');
app.use(prediction);

const users = require('./routes/users');
app.use(users);

app.get('/',(req,res)=> res.send('Hello World'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})