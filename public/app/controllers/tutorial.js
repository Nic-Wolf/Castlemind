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
	this.game = function () {
		$location.path('/game');
	};

	// make a list of messages to appear as the slides go
	var messages = [
		'Your objective is to guess the path that the computer took to the castle.',
		'Click next to start the tutorial.',
		'You can see the start and end points.',
		"You can also see hints about the computer's moves.",
		"In this example, you can see all four movement types:",
		'  one space horizontal or vertical',
		'  one space diagonal',
		'  three spaces horizontal or vertical',
		'  three spaces diagonal',
		"There are always five moves, but not every kind of move will show up in a game",
		"Click next to see an example of a guess.",
		"Before each move, the possible next moves flash.",
		"Let's see what happens when a square is clicked.",
		"First click: pink.  Notice the pink square above?",
		"Second click: yellow. The squares in that bar show what colors you've guessed.",
		"Third click: pink.",
		"Fourth click: pink.",
		"The castle is the last click and the guess is complete.",
		"The hints update after a guess to show which squares you got correct.",
		"There are no more slides."
	];

	// state which message is the oldest to be displayed and which messages are
	// initially displayed
	this.messages = [messages[0]];
	addToMessages = function () {
		var visibleMessages = messages.slice(0,self.messages.length + 1);
		self.messages = visibleMessages.reverse();
	}


	// state the example board and solution variables
	this.example = exampleBoard.map(function (elem) {
		var result = elem;
		result.class = "square color-" + elem.colorKey;
		result.imgClass = "ng-hide";
		return result;
	});
	this.hints = exampleSolution.map(manageState.makeHint);
	this.hints.class = '';
	this.solution = exampleSolution;

	// give the start and end the correct styling
	this.example[12].class += ' a hasImage';
	this.example[12].imgClass = "";
	this.example[12].image = "../assets/img/o.png";
	this.example[6].class += ' b';

	this.moves = [{
		"class": 'square color-4 a'
	}];


	// set up a function to represent each click of the next button
	var slideNumber = 2;
	var slides = [
		gameRules,
		firstGuess,
		bePatient
	];



	$timeout( function () {
		addToMessages();
		slideNumber = 0;
		self.buttonClass = ' highlight';
	}, 2000);

	this.next = function () {
		slides[slideNumber](0);
		self.buttonClass = self.buttonClass.split(' highlight').join('');
		slideNumber = slides.length - 1;
	};

	// declare what will be highlighted after each direction is introduced
	var drawAttention = [
		[this.example[6], this.example[12]],
		[this.hints],
		[this.hints],
		[this.hints[0]],
		[this.hints[1]],
		[this.hints[2]],
		[this.hints[3]],
		[this.hints]
	];

	var self = this;

	function gameRules (num) {
		if (num > 0) {
			drawAttention[num - 1].forEach( function (elem) {
				elem.class = elem.class.split(' highlight').join('');
			});
		}
		if (num < drawAttention.length) {
			drawAttention[num].forEach( function (elem) {
				elem.class += ' highlight';
			});
		}
		addToMessages();
		if (self.messages.length > 5) {
		}
		num++;
		if (num <= drawAttention.length) {
			$timeout( function () {
				gameRules(num);
			},3000);
		} else {
			slideNumber = 1;
			self.buttonClass = ' highlight';
		}
	}

	// declare what squares are legal after each click
	var legalMoves = [
		[7, 11, 13, 17],
		[5, 7, 15, 17],
		[18],
		[0],
		[6],
		[]
	];

	var path = [11, 15, 18, 0, 6];
	function firstGuess (num) {
		addToMessages();
		if (num === 0) {
			legalMoves[num].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		}

		if (num > 1 && num <= 6) {
			legalMoves[num - 2].forEach( function (elem) {
				self.example[elem].class = self.example[elem].class.split(' highlight').join('');
			});
			if (num < 6) {
				self.moves.push({
					"class": self.example[path[num - 2]].class
				});
				self.example[path[num - 2]].class += ' hasImage';
				self.example[path[num - 2]].imgClass = "";
				var string = self.solution[num - 1].direction;
				var hint = string.split(' ').reduce(function (prev, curr) {return prev + curr[0];}, '');
				self.example[path[num - 2]].image = "../assets/img/" + hint + ".png";
				legalMoves[num - 1].forEach( function (elem) {
					self.example[elem].class += ' highlight';
				});
			}
		}

		if (num === 6) {
			self.moves = self.moves.slice(0,1);
			path.forEach( function (elem) {
				var square = self.example[elem];
				square.class = square.class.split(' hasImage').join('');
				square.imgClass = "ng-hide";
				delete square.image;
				self.example[elem] = square;
			});
			self.hints[1].class += ' color-3';
			self.example[6].class += ' highlight';
		} 

		if (num === 7) {
			self.example[6].class = self.example[6].class.split(' highlight').join('');
			self.hints[1].class += ' highlight';
		}

		num++;
		if (num <= 8) {
			$timeout(function () {
				firstGuess(num);
			}, 4000);
		} else {
			slideNumber = 2;
		}
	}

	function bePatient () {
		self.statement = "Please have patience."
		$timeout(function () {
			delete self.statement;
		}, 1000);
	}
}]);