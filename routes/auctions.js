'use strict';

var express = require('express');
var router = express.Router();


var Auction = require('../models/auction');
var User = require('../models/user');

//1
router.get('/', (req, res) => {
  Auction.find({}, (err, auctions) => {
    return err ? res.status(400).send(err) : res.send(auctions);
  });
});

//2
router.post('/', User.isLoggedIn, (req, res) => {
  Auction.addNewItem(req.body, req.user._id, (err, auction) => {
    res.status(err ? 400 : 200).send(err || auction);
  });
});

//3
router.get('/:id', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.id, (err, auction) => {
    res.status(err ? 400 : 200).send(err || auction);
  });
});

//4
router.put('/:id', User.isLoggedIn, (req, res) => {
  Auction.updateItem(req.user._id, req.params.id, req.body, (err, updatedItem) => {
    res.status(err ? 400 : 200).send(err || updatedItem);
  });
});

//5
router.delete('/:id', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.id, (err, auction) => {
    if(auction.bids[0].itemBidder.toString() !== req.user._id.toString()) return res.status(400).send('Unauthorized! You are not allowed to delete this item.');
    Auction.findByIdAndRemove(req.params.id, (err) => {
      res.status(err ? 400 : 200).send(err || `${req.params.id} deleted!`);
    });
  });
});

//6
router.post('/:id/newBid', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.id, (err, auction) => {
    if(auction.bids[0].itemBidder.toString() === req.user._id.toString()) return res.status(400).send('Bidding on your own item is prohibited.');
    if(err) return res.status(400).send(err);
    auction.newBid(req.user._id, req.body.bidValue, (err) => {
      res.status(err ? 400 : 200).send(err || `New bid.`);
    })
  })
});

//7
router.delete('/:auctionId/cancelBid/:bidId', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.auctionId, (err, auction) => {
    if(err) return res.status(400).send(err);
    auction.cancelBid(req.params.bidId, req.user._id, (err) => {
      res.status(err ? 400 : 200).send(err || `Bid removed!`);
    })
  })
});

module.exports = router;
