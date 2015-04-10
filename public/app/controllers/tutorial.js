var tutApp = angular.module('tutApp', ['ngCookies']);
var manageState = require('../services/manageState.js');

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
];

var exampleSolution = [
	{ index: 12, direction: 'orthogonal', solution: 3 },
  { index: 7, direction: 'diagonal', solution: 4 },
  { index: 3, direction: 'long orthogonal', solution: 3 },
  { index: 18, direction: 'long diagonal', solution: 3 },
  { index: 0, direction: 'diagonal', solution: 1 },
  { index: 6 }
];


// ************************************************************************ //
// Begin controller
// ************************************************************************ //
tutApp.controller('tutorialController', ['$location', '$timeout',
	function($location, $timeout){
	// declare what squares are legal after each click and what the clicks are
	var pathStuck = {
		path: [11, 17, 2],
		animate: false
	};
	var pathGuess = {
		path: [11, 15, 18, 0, 6],
		animate: false
	};
	var pathCorrect = {
		path: [7, 3, 18, 0, 6],
		animate: false,
		solution: true
	};

	this.game = function () {
		pathStuck.animate = false;
		pathGuess.animate = false;
		pathCorrect.animate = false;
		$location.path('/game');
	};

	// This is a complete list of messages for the tutorial
	var messages = [
		'',
		'Your job: Figure out the secret path that leads to the castle in five moves.',
		"You get hints about the secret path, but there may be several paths using these moves.",
		"Choices like this one will leave you stuck.  You will have to guess again.",
		"Many paths will get you there, like the one below.  But this isn't the secret path either.",
		"After each guess you see how close you got.  In this case the first square is a desert.",
		"This time, the guess is the secret path. Remember, you only win if you find the secret path!"
	];

	// this.messages starts with only one message
	this.messages = [messages[0]];

	// addToMessages adds a message to the beginning of this.messages
	addToMessages = function () {
		var visibleMessages = messages.slice(0,self.messages.length + 1);
		self.messages = visibleMessages.reverse();
	}


	// initialize the board
	this.example = exampleBoard.map(function (elem) {
		var result = elem;
		result.class = "square color-" + elem.colorKey;
		result.imgClass = "ng-hide";
		return result;
	});

	// initialize the hints
	this.hints = exampleSolution.map(manageState.makeHint);
	this.hints.class = '';
	this.solution = exampleSolution;

	// give the start and end the correct styling
	this.example[12].class += ' a hasImage';
	this.example[12].imgClass = "";
	this.example[12].image = "../assets/img/o.png";
	this.example[6].class += ' b';

	// initialize the user guesses
	this.moves = [{
		"class": 'square color-4 a'
	}];

	// prompt the user to start the tutorial after two seconds
	$timeout( function () {
		addToMessages();
		pathStuck.animate = false;
		pathGuess.animate = false;
		pathCorrect.animate = false;
		viewNumber = 0;
	}, 0);


	// set up a function to represent each click of the next button
	// there are three "slides" and each slide has several "views"
	var viewNumber = 5;

	this.next = function () {
		nextView(viewNumber);
	};



	var self = this;

	// ******************************************************************** //
	// first slide
	// ******************************************************************** //


	function nextView (num) {
		addToMessages();
		if (num === 0) {
			self.hints.class += ' highlight';
		} else if (num === 1) {
			self.hints.class = '';
			pathStuck.animate = true;
			animation(0, pathStuck);
		} else if (num === 2) {
			clearPath(pathStuck.path);
			pathStuck.animate = false;
			pathGuess.animate = true;
			animation(0, pathGuess);
		} else if (num === 3) {
			clearPath(pathGuess.path);
			pathGuess.animate = false;
			self.hints[1].class += ' color-3 highlight';
			[7,11].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		} else if (num === 4) {
			self.hints[1].class = self.hints[1].class.split(' highlight').join('');
			[7,11].forEach( function (elem) {
				self.example[elem].class = self.example[elem].class.split(' highlight').join('');
			})
			pathCorrect.animate = true;
			animation(0, pathCorrect);
		} else {
			pathCorrect.animate = false;
			clearPath(pathCorrect.path);
		}


		if (num <= 5) {
			viewNumber++;
		} else {
			// this is the end of the tutorial
		}

	}// end nextView()


	// ******************************************************************* //
	// support functions
	// ******************************************************************* //

	// animation mimics a guess
	function animation (number, examplePath) {
		$timeout( function () {
			if (number < examplePath.path.length && examplePath.animate) {
					click(number, examplePath.path);
					animation(number + 1, examplePath);
			} else if (examplePath.animate) {
				$timeout( function () {
					if (examplePath.solution) {
						show();
					}
					clearPath(examplePath.path);
					animation(0, examplePath);
				},250);
			}
		}, 500);
	}

	// clearPath removes the styling that's added by a click
	function clearPath (path) {
		self.moves = self.moves.slice(0,1);
		path.forEach( function (elem) {
			var square = self.example[elem];
			square.class = square.class.split(' hasImage').join('');
			square.imgClass = "ng-hide";
			delete square.image;
			self.example[elem] = square;
		});
	}

	// click mimics the user clicking on a square
	function click (number, path) {
		self.moves.push({
			"class": self.example[path[number]].class
		});
		if (self.example[path[number]].class.indexOf(' b') === -1) {
			self.example[path[number]].class += ' hasImage';
			self.example[path[number]].imgClass = "";
			var string = self.solution[number + 1].direction;
			var hint = string.split(' ').reduce(function (prev, curr) {return prev + curr[0];}, '');
			self.example[path[number]].image = "../assets/img/" + hint + ".png";
		}
	}

	// this shows the full solution
	function show () {
		self.hints.slice(1,5).forEach( function (elem, ind) {
			var square = self.example[exampleSolution[ind + 1].index];
			elem.class = square.class;
		});
	}
}]);