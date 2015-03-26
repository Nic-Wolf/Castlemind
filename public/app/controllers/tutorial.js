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
	];

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
tutApp.controller('tutorialController', ['$location', '$timeout',
	function($location, $timeout){
	this.game = function () {
		$location.path('/game');
	};

	var messages = [
		'Your objective is to guess the path that the computer took to the castle.',
		'Click next to start the tutorial.',
		'You can see the start and end points.',
		"You can also see hints about the computer's moves",
		"Before each move, the possible next moves flash.",
		"Each time you click, the board updates to show your progress.",
		"Click next to see an example of a guess.",
		"First click: pink",
		"Second click: blue",
		"Third click: red",
		"Fourth click: green",
		"Fifth click: castle",
		"That was the first guess."
	];

	// state which message is the oldest to be displayed and which messages are
	// initially displayed
	this.startMessages = 0;
	this.messages = messages.slice(0,2);

	// state the example board and solution variables
	this.example = exampleBoard.map(function (elem) {
		var result = elem;
		result.class = "square color-" + elem.colorKey;
		result.imgClass = "ng-hide";
		return result;
	});
	this.solution = exampleSolution;

	// give the start and end the correct styling
	this.example[12].class += ' a hasImage';
	this.example[12].imgClass = "";
	this.example[12].image = "../assets/img/o.png";
	this.example[6].class += ' b';

	var self = this;

	var path = [11, 16, 19, 1,6];

	// set up a function to represent each click of the next button
	var slideNumber = 0;
	var slides = [
		gameRules,
		firstGuess,
	];

	this.next = function () {
		slides[slideNumber](0);
		slideNumber++;
	}

	// declare what will be highlighted after each direction is introduced
	var drawAttention = [
		[self.example[6], self.example[12]]
	];


	function gameRules (num) {
		self.messages.push(messages[self.messages.length]);
		if (self.messages.length > 5) {
			self.startMessages++;
		}
		num++;
		if (num <= 4) {
			$timeout( function () {
				gameRules(num);
			},2000);
		} else {
			legalMoves[0].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
		}
	}

	// declare what squares are legal after each click
	var legalMoves = [
		[7, 11, 13, 17],
		[10,16],
		[1,19],
		[1],
		[0,2,6],
		[]
	];

	function firstGuess (num) {
		self.messages.push(messages[self.messages.length]);
		self.startMessages++;
		legalMoves[num].forEach( function (elem) {
			self.example[elem].class = self.example[elem].class.split(' highlight').join('');
		});
		if (self.example[path[num]].class.indexOf(' b') === -1) {
			self.example[path[num]].class += ' hasImage';
			self.example[path[num]].imgClass = "";
			var string = self.solution[num + 1].direction;
			var hint = string.split(' ').reduce(function (prev, curr) {return prev + curr[0];}, '');
			self.example[path[num]].image = "../assets/img/" + hint + ".png";
			legalMoves[num + 1].forEach( function (elem) {
				self.example[elem].class += ' highlight';
			});
			num++;
			if (num < path.length) {
				$timeout(function () {
					firstGuess(num);
				}, 2000);
			}
		}
	}
}]);