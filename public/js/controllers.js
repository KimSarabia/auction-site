'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, UserAuth, $state, $cookies){
  console.log("main ctrl");
  $scope.logOut = function(){
    console.log("logout trigger click");
    document.cookie = '';
  }
});

app.controller('registerCtrl', function($scope, UserAuth, $state){
  console.log("yay!");

  function renderUserData(){
    UserAuth.getUsers()
    .then(function(res){
      console.log("res.data", res.data);
    }, function(err){
      console.error("err", err);
    });
  }

  renderUserData();

  $scope.register = function(user) {
    console.log("user", user);
    UserAuth.register(user)
      .then(function(res) {
        $scope.regUser = res.data;
        console.log('res:', res.data);
      }, function(err) {
        console.error(err);
      });
  };
});

app.controller('signinCtrl', function($scope, UserAuth, $stateParams, $state){
  console.log("signinCtrl");
  $scope.signin = function(user){
    UserAuth.signin(user)
    .then(function(res){
      $state.go('profile');
      console.log("signin res data", res.data);
    }, function(err){
      console.log("signin err", err);
    });
  };

}); //end signinCtrl

app.controller('profileCtrl', function($scope, UserAuth, $state){
  console.log("profileCtrl");
  function renderUserData(){
    UserAuth.getUser()
    .then(function(res){
      $scope.user = res.data;
      console.log("profile res", res.data);
    }, function(err){
      console.error("err", err);
    });
  }

  renderUserData();

  $scope.editProfile = function(user){
    var newProfile = angular.copy(user);
    $scope.user = newProfile;
  }; //end editProfile

  $scope.updateProfile = function(user){
    console.log("user", user);
    UserAuth.updateUser(user)
    .then(function(res){
      renderUserData();
    }, function(err){
      console.error("update error: ", err);
    });
  }
});//end profileCtrl
