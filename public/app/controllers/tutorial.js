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

	// This is a complete list of messages for the tutorial
	var messages = [
		'',
		'Your objective is to guess the path that the computer took to the castle.',
		'Click next to start the tutorial.',
		'Here are the start and end points.',
		"These are hints about the computer's moves.",
		"In this example, you can see all four movement types:",
		'one space horizontal or vertical',
		'one space diagonal',
		'three spaces horizontal or vertical',
		'three spaces diagonal',
		"There are always five moves in one game.",
		"Let's see what a guess looks like.",
		"Before each move, the possible next moves flash.",
		"First click: desert.  Notice the pink square in the user moves bar?",
		"Second click: valley.",
		"Third click: desert.",
		"Fourth click: desert.",
		"The castle is the last click.  Now the guess is complete.",
		"The hints update after a guess to show which squares you got correct.",
		"Click next to see the solution.",
		"The first square must be desert, but there are two desert squares.",
		"Let's try the one we didn't use last time.",
		"Second click: forest",
		"Third click: desert",
		"Fourth click: desert",
		"The last click is the castle.",
		"This time the hints fill up all the way.",
		"The board didn't reset either.",
		"That was the correct guess! That's all there is to it."
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
	}, 0);
	$timeout( function () {
		addToMessages();
		slideNumber = 0;
	}, 2000);


	// set up a function to represent each click of the next button
	// there are three "slides" and each slide has several "views"
	var slides = [
		gameRules,
		firstGuess,
		correctGuess,
		bePatient
	];
	var slideNumber = slides.length - 1;
	var viewNumber = 0;
	var timesClicked = 0;

	this.next = function () {
		slides[slideNumber](viewNumber);
		timesClicked++;
	};



	var self = this;

	// ******************************************************************** //
	// first slide
	// ******************************************************************** //

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
		if (num < drawAttention.length) {
			viewNumber++;
		} else {
			slideNumber = 1;
			viewNumber = 0;
		}
	}// end gameRules()


	// ******************************************************************** //
	// second slide
	// ******************************************************************** //

	// declare what squares are legal after each click and what the clicks are
	var legalMovesGuess = [
		[7, 11, 13, 17],
		[5, 7, 15, 17],
		[0, 18],
		[0],
		[6],
		[]
	];
	var pathGuess = [11, 15, 18, 0, 6];

	function firstGuess (num) {
		addToMessages();
		if (num < 5) {
			click(num - 1, pathGuess, legalMovesGuess);
		}

		if (num === 5) {
			self.moves = self.moves.slice(0,1);
			pathGuess.forEach( function (elem) {
				var square = self.example[elem];
				square.class = square.class.split(' hasImage').join('');
				square.imgClass = "ng-hide";
				delete square.image;
				self.example[elem] = square;
			});
			self.hints[1].class += ' color-3';
			self.example[6].class += ' highlight';
		} 

		if (num === 6) {
			self.example[6].class = self.example[6].class.split(' highlight').join('');
			self.hints[1].class += ' highlight';
		}

		if (num < 7) {
			viewNumber++;
		} else {
			self.hints[1].class = self.hints[1].class.split(' highlight').join('');
			viewNumber = 0;
			slideNumber = 2;
		}
	}// end firstGuess()


	// ******************************************************************** //
	// third slide
	// ******************************************************************** //

	// declare what squares are legal after each click
	var legalMovesCorrect = [
		[7, 11],
		[1, 11, 3, 13],
		[0, 18],
		[0],
		[6],
		[]
	];
	var pathCorrect = [7, 3, 18, 0, 6];

	function correctGuess (num) {
		addToMessages();
		if (num < 5) {
			click(num - 1, pathCorrect, legalMovesCorrect);
		}

		if (num === 5) {
			self.moves.push({"class": 'square b'});
			self.example[6].class = self.example[6].class.split(' highlight').join('');
			self.hints.slice(1,5).forEach( function (elem, ind) {
				var square = self.example[exampleSolution[ind + 1].index];
				elem.class = square.class;
			});
		}

		if (num === 6) {
			self.hints.class += ' highlight';
		}

		if (num === 7) {
			self.hints.class = self.hints.class.split(' highlight').join('');
			pathCorrect.forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		}

		if (num === 8) {
			pathCorrect.forEach( function (elem) {
				self.example[elem].class = self.example[elem].class.split(' highlight').join('');
			});
		}

		if (num < 8) {
			viewNumber++;
		} else {
			viewNumber = 0;
			slideNumber = 3;
		}
	}// end correctGuess()


	// ******************************************************************* //
	// support functions
	// ******************************************************************* //

	function bePatient () {
		// This is nothing
	}

	function click (number, path, legalMoves) {
		if (number < 0) {
			legalMoves[0].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		}

		if (number >= 0) {
			legalMoves[number].forEach( function (elem) {
				self.example[elem].class = self.example[elem].class.split(' highlight').join('');
			});
			self.moves.push({
				"class": self.example[path[number]].class
			});
			self.example[path[number]].class += ' hasImage';
			self.example[path[number]].imgClass = "";
			var string = self.solution[number + 1].direction;
			var hint = string.split(' ').reduce(function (prev, curr) {return prev + curr[0];}, '');
			self.example[path[number]].image = "../assets/img/" + hint + ".png";
			legalMoves[number + 1].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		}
	}
}]);