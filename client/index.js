'use strict';

var gameBoard = require('./gameBoard.js');

// routeApp controlls the different views for this page
var routeApp = angular.module('routeApp', [
  'ngRoute',
  'gameApp'
  ]);

routeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/game', {
        templateUrl: './game',
        controller: 'gameController as gCtrl'
      }).
      otherwise({
        redirectTo: '/game'
      });
  }]);