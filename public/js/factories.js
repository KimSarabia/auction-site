'use strict';

var app = angular.module('myApp');

app.factory('AuctionAuth', function($http, $cookies) {

    function getUsers() {
        return $http.get('./api/users');
    }

    function getUser() {
        return $http.get('./api/users/profile');
    }

    function getAuctions() {
        return $http.get('./api/auctions');
    }

    function getAuction() {
        return $http.get(`./api/auctions/${id}`);
    }

    function addBid(auction) {
      return $http.post(`./api/auctions/${id}/addBid/`, {"bidValue": bidValue});
    }

    function cancelBid(auction) {
        return $http.delete('./api/auctions/:id/cancelBid/', auction);
    }

    function updateItem(auction) {
        return $http.put(`./api/auctions/${id}/updateItem/`, {"value": value});
    }

    return {
        getUsers: getUsers,
        getAuctions: getAuctions,
        getUser: getUser,
        getAuction: getAuction,
        addBid: addBid,
        cancelBid: cancelBid,
        updateItem: updateItem,
    }


});

app.factory('UserAuth', function($http, $cookies) {
//
    function getUsers() {
        return $http.get('./api/users');
    }

    function getAuctions() {
        return $http.get('./api/auctions');
    }

    function getUser() {
        return $http.get('./api/users/profile');
    }
//
    function register(user) {
        return $http.post('./api/users/register', user);
    }
//
    function signin(user) {
        return $http.post('./api/users/authenticate', user);
    }
//
    function updateUser(user) {
      return $http.put('./api/users/profile', user);

    }

    function logOut() {
      return $http.delete('./api/users/logout');
    }

    return {
        getUsers: getUsers,
        getAuctions: getAuctions,
        getUser: getUser,
        register: register,
        signin: signin,
        updateUser: updateUser,
        logOut: logOut
    }


});
