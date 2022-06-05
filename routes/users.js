const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//register
router.post('/register', (req, res, next) => {
    const newUser = new User ({
        name: req.body.name,
        // dob: req.body.dob,
        number: req.body.number,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err) {
        res.json({'success': false, msg: 'Failed to register user'});
        } else {
        res.json({'success': true, msg: 'Successfully registered! Login to continue'});
        }
    });
});

// email exist
router.post('/emailExist', (req, res, next) => {
  const email = req.body.email;
  // console.log(req.body);
  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Email does not exist'});
    } else {
      return res.json({success: true, msg: 'Email is already taken'});
    }
  })
})

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user) {
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const token = jwt.sign({data: user}, process.env.MONGODB_URL, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          })
        } else {
          return res.json({success: false, msg: 'Wrong password'});
        }
      });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

// to update profile
router.put('/updateProfile', (req, res, next) => {
  var userDetail = {
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    username: req.body.username,
  }
  User.findByIdAndUpdate(req.body.id, {$set: userDetail}, {new: true}, (err, doc) => {
    if(!err) {
      res.send(doc);
    } else {
      console.log(err);
      res.send(err);
    }
  })
})

//To delete Profile
router.post('/deleteProfile', (req, res, next) => {
  User.findByIdAndRemove(req.body._id, (err, doc) => {
    if(!err){
      res.send(doc);
    } else {
      // console.log(err);
      res.send(err);
    }
  })
})

module.exports = router;