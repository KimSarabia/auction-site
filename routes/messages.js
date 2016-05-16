var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/message');

router.get('/', function(req, res, next){
  res.send();
});

router.post('/', function(req, res, next){
  Message.find({})
});
