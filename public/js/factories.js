'use strict';

var app = angular.module('myApp');

app.factory('UserAuth', function($http, $cookies){

function getUsers(){
  return $http.get('/users');
}

function getMessages(){
  return $http.get('/messages');
}

function getUser(){
  return $http.get(`/users/profile`);
}

function register(user){
  return $http.post('/users/register', user);
}

function signin(user){
  return $http.post('/users/authenticate', user);
}

function updateUser(user){
  var id = user._id;
  return $http.put(`/users/${id}`, user);
}

function logOut(){
  return $cookies.remove('appNameCookie')
}

return {
  getUsers:getUsers,
  getMessages:getMessages,
  getUser:getUser,
  register:register,
  signin:signin,
  updateUser:updateUser,
  logOut:logOut
}


});
