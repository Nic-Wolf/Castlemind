'use strict';

var gameBoard = require('./gameBoard.js');

var routeApp = angular.module('routeApp', [
  'ngRoute',
  'gameApp'
  ]);

routeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: './game',
        controller: 'gameController as gCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);