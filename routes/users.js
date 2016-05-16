var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
  .populate('messages')
  .exec(function(err, users){
    console.log("users", users);
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.post('/register', function(req, res){
  User.register(req.body, function(err){
    res.status(err ? 400 : 200).send(err);
  });
}); //end post to register

router.post('/authenticate', function(req, res){

  User.authenticate(req.body, function(err, token){

    if (err) {
      res.status(400).send(err);
    } else {
      res.cookie('accessToken', token).send(token);
    }
  }); //end User.authenticate
}); //end post to authenticate

//   /api/users/logout
router.delete('/logout', (req, res) => {
  res.clearCookie('accessToken').send('Successfully logged out.');
});

router.get('/profile', User.isLoggedIn, (req, res) => {
  res.send(req.user);
})

// /api/users/profile
router.put('/profile', User.isLoggedIn, (req, res) => {
  User.editProfile(req.user._id, req.body, (err, edtUser) => {
    if(err) return res.status(400).send(err);
    res.send(edtUser);
  })
})

// /api/users/people
router.get('/people', User.isLoggedIn, (req, res) => {
  User
    .find({_id: {$ne: req.user._id}}) // excludes the logged in user
    .select({password: false})
    .exec((err, users) => {
      return err ? res.status(400).send(err) : res.send(users);
    });
})

// /api/users/people
router.get('/people/:id', User.isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .select({password: false})
    .exec((err, user) => {
    return err ? res.status(400).send(err) : res.send(user);
  })
})

module.exports = router;
