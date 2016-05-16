'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


var Auction;

var Auction = require('../models/auction');

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

    highestBid: {
        value: {
            type: Number
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

auctionSchema.statics.addNewItem = (auctionObj, userId, cb) => {
    if (!auctionObj) res.send('Not proper auction format!');

    var auction = new Auction({
        itemName: auctionObj.itemName,
        imgUrl: auctionObj.imgUrl,
        initialBid: auctionObj.initialBid,
        exp: auctionObj.exp,
        highestBid: {
            value: auctionObj.finalPrice,
            user: userId
        }
    });
    auction.save(cb);
}

auctionSchema.statics.updateItem = (userId, auctionId, updatedItem, cb) => {
    Auction.findById(auctionId, (err, prev) => {
        if (err) cb(err);
        if (prev.bids[0].madeBy.toString() !== userId.toString()) {
            return cb({
                err: 'You are not authorized to make any changes.'
            });
        }

        var auction = {
            itemName: updatedItem.itemName,
            imgUrl: updatedItem.imgUrl,
            exp: updatedItem.exp
        };

        var currentlyUpdating = {};

        for (var key in auction) {
            if (auction[key] !== undefined && auction[key] !== null) {
                currentlyUpdating[key] = auction[key];
            }
        }

        Auction.findByIdAndUpdate(auctionId, {
            $set: currentlyUpdating
        }, {
            new: true
        }, cb);
    });
};

auctionSchema.methods.newBid = function(userId, value, cb) {
    if (this.bids[this.bids.length - 1].value >= value) {
        return cb({
            err: 'Your bid must be higher than the current value.'
        });
    }

    var bid = {
        "bidFrom": userId,
        "value": value
    };

    console.log(bid);
    this.bids.push(bid);
    this.save(cb);
};

auctionSchema.methods.cancelBid = function(bidId, userId, cb) {
    var initialBid_id = this.bids[0]._id.toString();
    if (initialBid_id === bidId.toString()) {
        return cb({
            err: 'Invalid action! You cannot delete the initial value'
        });
    }
    var bidderId = this.bids.filter((bid) => {
        return bid._id.toString() === bidId.toString();
    })[0].bidFrom;

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
