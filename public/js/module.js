'use strict';

var app = angular.module('myApp', ['ui.router', 'ngCookies']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('register', {
    url: '/register',
    templateUrl: '/html/register.html',
    controller: 'registerCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: '/html/signin.html',
    controller: 'signinCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: '/html/profile.html',
    controller: 'profileCtrl'
  })
  .state('auction', {
    url: '/auction',
    templateUrl: '/html/auction.html',
    controller: 'auctionCtrl'
  });
  $urlRouterProvider.otherwise('/register');

});
