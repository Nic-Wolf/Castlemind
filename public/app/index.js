'use strict';

var mainView  = require('./controllers/mainView.js');
var gameBoard = require('./controllers/gameBoard.js');
var tutorial  = require('./controllers/tutorial.js');

// routeApp controlls the different views for this page
var routeApp = angular.module('routeApp', [
	'ngRoute',
	'mainApp',
	'tutApp',
	'gameApp'
]);

routeApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when ('/main', {
			templateUrl: '/main',
			controller: 'mainController as mCtrl'
		}).
		when('/test', {
			templateUrl: '/test',
		}).
		when('/tutorial', {
			templateUrl: '/tutorial',
			controller: 'tutorialController as tCtrl'
		}).
		when('/game', {
			templateUrl: '/game',
			controller: 'gameController as gCtrl'
		}).
		otherwise({
			redirectTo: '/main'
	});
}]);