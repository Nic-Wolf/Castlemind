var mainApp = angular.module('mainApp', []);
	
mainApp.controller('mainController', ['$location', function($location) {
	
	this.header = "CastleMind";

	this.newGame = function() {
		$location.path('/game');
	}

	this.tutorial = function() {
		$location.path('/tutorial');
	}
}]);