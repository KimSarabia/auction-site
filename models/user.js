'use strict';

var mongoose = require('mongoose');
var moment = require('moment');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

var User;

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: String,
  email: { type: String, required: true },
  about: String,
  isAdmin: {type: Boolean, default: false},
  auctions: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Auctions' } ]
});

userSchema.statics.isLoggedIn = function(req,res,next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err){
      return res.status(401).send( { error: 'User is not authenticated' } );
    }

    User
    .findById(payload._id)
    .select({password: false})
    .exec((err,user) => {
      if(err || !user) {
        return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
      }
      req.user = user;
      next();
    });
  });
};

userSchema.statics.register = function(userObj, cb) {
  User.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'Username already exists!' })

    bcrypt.hash(userObj.password, 10, (err,hash) => {
      if(err) return cb(err);

      var user = new User({
        username: userObj.username,
        password: hash,
        image: userObj.image,
        email: userObj.email,
        about: userObj.about
      })

      user.save(cb)
    })
  })
};

userSchema.statics.editProfile = function(userId, newUser, cb) {
  User.findByIdAndUpdate(userId, { $set: newUser }, {new: true}, cb);
};


userSchema.statics.authenticate = function(userObj, cb) {
  this.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
      if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });

      var token = dbUser.makeToken();

      cb(null, token);
    })
  });
};

userSchema.methods.makeToken = function(){
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix() // in seconds
  }, JWT_SECRET);
  return token;
};

User = mongoose.model('User', userSchema);

module.exports = User;
