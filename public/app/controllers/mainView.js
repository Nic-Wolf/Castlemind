var mainApp = angular.module('mainApp', []);
	
mainApp.controller('mainController', ['$location', function($location) {

	// commented this out so it doesn't conflict with new title page text
	
	// this.header = "CastleMind";

	this.newGame = function() {
		$location.path('/game');
	}

	this.tutorial = function() {
		$location.path('/tutorial');
	}
}]);