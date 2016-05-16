var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/auctions', require('./auctions'));

router.use('/users', require('./users'));

module.exports = router;
