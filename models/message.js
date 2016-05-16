'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET;

var Message;

var User = require('../models/user');

var messageSchema = new mongoose.Schema({
  to: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  from: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  messages: String
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
