var tutApp = angular.module('tutApp', ['ngCookies']);

// ********************************************************************** //
// exampleBoard and exampleSolution are just an example starting state
// ********************************************************************** //

var exampleBoard = [
		{ value: [ 0, 0 ], colorKey: 3 },
	  { value: [ 0, 1 ], colorKey: 2 },
	  { value: [ 0, 2 ], colorKey: 0 },
	  { value: [ 0, 3 ], colorKey: 4 },
	  { value: [ 0, 4 ], colorKey: 1 },
	  { value: [ 1, 0 ], colorKey: 2 },
	  { value: [ 1, 1 ], colorKey: 1 },
	  { value: [ 1, 2 ], colorKey: 3 },
	  { value: [ 1, 3 ], colorKey: 0 },
	  { value: [ 1, 4 ], colorKey: 4 },
	  { value: [ 2, 0 ], colorKey: 0 },
	  { value: [ 2, 1 ], colorKey: 3 },
	  { value: [ 2, 2 ], colorKey: 4 },
	  { value: [ 2, 3 ], colorKey: 1 },
	  { value: [ 2, 4 ], colorKey: 2 },
	  { value: [ 3, 0 ], colorKey: 1 },
	  { value: [ 3, 1 ], colorKey: 4 },
	  { value: [ 3, 2 ], colorKey: 2 },
	  { value: [ 3, 3 ], colorKey: 3 },
	  { value: [ 3, 4 ], colorKey: 0 },
	  { value: [ 4, 0 ], colorKey: 4 },
	  { value: [ 4, 1 ], colorKey: 0 },
	  { value: [ 4, 2 ], colorKey: 1 },
	  { value: [ 4, 3 ], colorKey: 2 },
	  { value: [ 4, 4 ], colorKey: 3 }
	].map(function (elem) {
		var result = elem;
		result.class = "square color-" + elem.colorKey;
		result.imgClass = "ng-hide";
		return result;
	});

	var exampleSolution = [
		{ index: 12, direction: 'orthogonal', solution: 3 },
	  { index: 7, direction: 'orthogonal', solution: 0 },
	  { index: 8, direction: 'long orthogonal', solution: 2 },
	  { index: 23, direction: 'long diagonal', solution: 2 },
	  { index: 5, direction: 'orthogonal', solution: 1 },
	  { index: 6 }
  ];

// ************************************************************************ //
// Begin controller
// ************************************************************************ //
tutApp.controller('tutorialController', ['$location', function($location){
	this.game = function () {
		$location.path('/game');
	};

	this.example = exampleBoard;
	this.solution = exampleSolution;

	this.example[12].class += ' a hasImage';
	this.example[12].imgClass = "";
	this.example[12].image = "../assets/img/o.png";
	this.example[6].class += ' b';

	var self = this;
	var highlights = [7, 11, 13, 17];
	highlights.forEach( function (elem) {
		self.example[elem].class += ' highlight';
	});

	var path = [11, 16, 19, 1];
	var num = 0;
	this.step = function () {
		this.example[path[num]].class += ' hasImage';
		this.example[path[num]].imgClass = "";
		var string = this.solution[num + 1].direction;
		var hint = string.split(' ').reduce(function (prev, curr) {return prev + curr[0];}, '');
		this.example[path[num]].image = "../assets/img/" + hint + ".png";
		num++;
		if (num < path.length) {
			self.next();
		}
	}

	this.next = function () {
		highlights.forEach( function (elem) {
			self.example[elem].class = self.example[elem].class.split(' highlight').join('');
		});
		this.step();
	}
}]);