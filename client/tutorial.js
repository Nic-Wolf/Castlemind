var tutApp = angular.module('tutApp', ['ngCookies']);

tutApp.controller('tutorialController', ['$location', function($location){
	this.game = function () {
		$location.path('/game');
	};
}]);