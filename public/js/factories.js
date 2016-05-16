'use strict';

var app = angular.module('myApp');

app.factory('AuctionAuth', function($http) {

    function getUsers() {
        return $http.get('/users');
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

app.factory('UserAuth', function($http) {

    function getUsers() {
        return $http.get('/users');
    }

    function getAuctions() {
        return $http.get('/auctions');
    }

    function getUser() {
        return $http.get(`/users/profile`);
    }

    function register(user) {
        return $http.post('/users/register', user);
    }

    function signin(user) {
        return $http.post('./api/users/authenticate', user);
    }

    function updateUser(user) {
      return $http.put('./api/users/profile', editedUserObj);

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
