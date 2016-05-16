'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


var Auction;

var User = require('../models/user');

var auctionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    itemName: {
        type: String,
        required: true
    },

    imgUrl: {
        type: String,
    },

    initialBid: {
        type: Number,
        required: true
    },

    exp: {
        type: Date,
        required: true
    },
    bids: [{
        itemBidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        bidValue: {
            type: Number,
            // required: true
        },
        bidDate: {
            type: String,
            // required: true
        }
    }]

});

auctionSchema.statics.addNewItem = (auctionObj, userId, cb) => {
    if (!auctionObj) res.send('Not proper auction format!');

    var auction = new Auction({
        owner: userId,
        itemName: auctionObj.itemName,
        imgUrl: auctionObj.imgUrl,
        initialBid: auctionObj.initialBid,
        exp: auctionObj.exp,
        bids: [{
            itemBidder: userId,
            bidValue: auctionObj.initialValue,
            bidDate: moment()
        }]
});
    auction.save(cb);
}

auctionSchema.statics.updateItem = (userId, auctionId, updatedItem, cb) => {
    Auction.findById(auctionId, (err, prev) => {
        if (err) cb(err);

        if(prev && prev.owner.toString() !== userId.toString()) return cb({err: 'Unauthorized! You are not the owner of this item.'})


        var auction = {
            itemName: updatedItem.itemName,
            imgUrl: updatedItem.imgUrl,
            exp: updatedItem.exp
        };

        var currentlyUpdating = {};
        for (var key in auction) {
            if (auction[key] !== undefined && auction[key] !== null) currentlyUpdating[key] = auction[key];
        }
        Auction.findByIdAndUpdate(auctionId, {
            $set: currentlyUpdating
        }, {
            new: true
        }, cb);
    })
}

auctionSchema.methods.addBid = function (userId, bidValue, cb) {
  if(this.bids[this.bids.length - 1].bidValue >= bidValue) return cb({err: 'Your bid must be higher then the highest bid!'});
  var bid = {
    "itemBidder": userId,
    "bidValue": bidValue,
    "bidDate": moment()
  }
  console.log(bid);
  this.bids.push(bid);
  this.save(cb);
}

//TODO: FIX THIS
auctionSchema.methods.cancelBid = function(bidId, userId, cb) {
    var initialBid_id = this.bids[0]._id.toString();
    if (initialBid_id === bidId.toString()) {
        return cb({
            err: 'Invalid action! You cannot delete the initial value'
        });
    }
    var bidderId = this.bids.filter((bid) => {
        return bid._id.toString() === bidId.toString();
    })[0].itemBidder;

    if (bidderId.toString() !== userId.toString()) {
        return cb({
            err: 'Invalid action! You are not authorized to remove this bid.'
        });
    }

    this.bids = this.bids.filter((bid) => {
        return bid._id.toString() !== bidId.toString();
    });

    this.save(cb);
};

var Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
