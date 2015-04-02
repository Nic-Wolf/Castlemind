(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/app/index.js":[function(require,module,exports){
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
},{"./controllers/gameBoard.js":"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/gameBoard.js","./controllers/mainView.js":"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/mainView.js","./controllers/tutorial.js":"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/tutorial.js"}],"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/gameBoard.js":[function(require,module,exports){
var manageState = require('../services/manageState.js');


var gameApp = angular.module('gameApp', ['ngCookies']);
	
gameApp.controller('gameController', ['$http', '$cookies', '$location', '$timeout',
	function($http, $cookies, $location, $timeout) {
	var self = this;
	self.points = 0;
	if (!$cookies.highScore) {
		self.highScore = 0;
	} else {
		self.highScore = Number($cookies.highScore);
	}

	// *************************************************************************** //
	//	countDown controlls the timeDisplay
	//		The player should have five minutes of play time to accumulate as many
	//		points as possible.
	//			The timer will pause after each game.
	//			At the end of the five minutes, the board will freeze.
	//		After the five minutes are up, the player may start another five minute
	//		session by pressing the new game button.
	// *************************************************************************** //
	self.countDown = function () {
		$timeout(function () {
			$cookies.elapsedTime = Number($cookies.elapsedTime) + Number(Date.now()) - Number($cookies.timeCheck);
			$cookies.timeCheck = Date.now();
			var minutes = Math.floor($cookies.elapsedTime / 60000);
			var seconds = Math.floor(($cookies.elapsedTime - minutes * 60000) / 1000);
			if ($cookies.victory) {
				self.timeDisplay = self.timeDisplay.split(' (paused)').join('') + ' (paused)';
			} else if (minutes < 5) {
				if (49 >= seconds) {
					self.timeDisplay = (4 - minutes) + ':' + (59 - seconds);
				} else {
					self.timeDisplay = (4 - minutes) + ':0' + (59 - seconds);
				}
				self.countDown();
			} else {
				self.timeDisplay = '0:00';
				self.squares.forEach( function (square) {
					delete square.click;
				});
			}
			$cookies.timeDisplay = self.timeDisplay;
		}, 500);
	}; // end countDown()
	self.message = "Welcome! Press New Game to Begin!";

	
	// ******************************************************* //
	// newGame starts the timer and gets a gameboard and path from the server
	// The controller is assigned the following values
	//		timeDisplay: shows the player their remaining time
	//		points: this reflects the running total for five minutes
	//		squares: the array of squares in the board
	//		solution: the path that the player is trying to guess
	//		moves: the moves that the player has guessed
	//		hints: the values that are displayed to the player
	// ******************************************************* //
	this.newGame = function() {
		if (!$cookies.playing || self.timeDisplay === '0:00') {
			$cookies.timeCheck = Date.now();
			$cookies.elapsedTime = 0;
			self.timeDisplay = '5:00';
			self.points = 0;
			$cookies.points = 0;
			self.results = [];
			$cookies.results = '';
			self.countDown();
		} else if (self.timeDisplay.indexOf(' (paused)') !== -1) {
			self.timeDisplay = self.timeDisplay.split(' (paused)').join('');
			$cookies.timeCheck = Date.now();
			self.countDown();
		}
		$cookies.playing = true;
		delete $cookies.victory;
		
		self.guesses = 0;
		$cookies.guesses = 0;
		$http.get('/api/game').
		success(setSquares).
		error(function(data, status, headers, config){
		});
	}; // end newGame()

	this.tutorial = function() {
		$location.path('/tutorial');
	};

	// ******************************************************* //
	// setSquares assigns each square a class and a click method
	// The beginning and ending points are given text values
	// The hints are given text values based on the solution
	// ******************************************************* //
	function setSquares (data) {
		manageState.stringState(data, function (state, solution) {
			$cookies.state = state;
			$cookies.solution = solution;
		});

		
		self.solution = data.path;
		self.squares = data.board.map(function (elem) {
			var result = elem;
			result.class = "square color-" + elem.colorKey; 
			result.imgClass = "ng-hide";
			result.click = click;
			return result;
		});

		self.squares[self.solution[self.solution.length - 1].index].class += ' b';
		self.moves = [];
		$cookies.moves = '';
		
		self.hints = self.solution.map(manageState.makeHint);
		
		self.squares[self.solution[0].index].class += ' a';
		self.squares[self.solution[0].index].click();
	} // end setSquares()

	// ************************************************************************* //
	// click has three main parts
	//	if there is room in the moves array, run increment moves
	//	highlight only the squares that are possible moves
	//	if the guess is complete, check the solution
	// ************************************************************************* //
	function click () {
		delete this.click;
		
		if (self.moves.length < 6) {
			manageState.incrementMoves(this, self.hints, self.moves, self.squares,
				function (square, hints, moves, squares) {
					this.class = square.class;
					this.imgClass = square.imgClass;
					this.image = square.image;
					self.hints = hints;
					self.moves = moves;
					self.squares = squares;
			});


			$cookies.moves += self.squares.indexOf(this) + '_';
		}

		self.moves[self.moves.length - 1].class += ' glow';

		if(self.moves.length >= 2) {
			self.moves[self.moves.length - 2].class = self.moves[self.moves.length - 2].class.split(" glow").join("");
		}

		var direction = self.solution[self.moves.length -1].direction;
		var thisy = this;
		var toHighlight = [];
		self.squares.forEach(function (square, index) {
			manageState.highlight(square, index, direction, self.moves.length, thisy,
				function (result) {
					if (result !== 'fuck') {
						toHighlight.push(result);
					}
				});
		});

		if (self.moves.length === 6) {
			manageState.resetGuess(
				self.moves, self.hints, self.squares, self.solution, self.guesses,
				self.results, function(moves, hints, squares, message, results, points) {
					self.moves = moves;
					self.hints = hints;
					self.squares = squares;
					self.message = message;
					if(!$cookies.victory && points) {
						self.results = results;
						$cookies.results = results.join('_');
						self.points = points;
						$cookies.points = points;
					}
					if (moves.length === 0) {
						self.guesses++;
						$cookies.guesses = self.guesses;
						$cookies.moves = '';
						self.squares = self.squares.map(function (elem) {
							var result = elem;
							result.click = click;
							return result;
						});
						self.squares[self.solution[0].index].click();
					} else {
						$cookies.victory = true;
						self.messageClass = 'theMessage';
						if (self.points > self.highScore) {
							self.highScore = self.points;
							$cookies.highScore = self.highScore;
						}
					}
				}
			);
		} else if (toHighlight.length === 0) {
			self.cancel();
			self.message = "Oops! You had nowhere to go.";
		} else {
			$timeout( function () {
				self.squares.forEach(function (square) {
					square.class = square.class.split(' highlight').join('');
				});
				if (!$cookies.victory) {
					toHighlight.forEach(function (elem) {
						self.squares[elem].class += ' highlight';
					});
				}
			}, 100);
		}

	} // end click()

	// cancel removes a partial guess
	this.cancel = function () {
		manageState.resetGuess(
			self.moves, self.hints, self.squares, self.solution, self.guesses,
			self.results, function(moves, hints, squares, message) {
				self.moves = moves;
				self.hints = hints;
				self.squares = squares;
				self.message = message;
				$cookies.moves = '';
				self.squares = self.squares.map(function (elem) {
					var result = elem;
					result.click = click;
					return result;
				});
				self.squares[self.solution[0].index].click();
			}
		);
	};

	// reset allows the page to refresh without trying to load a new board
	this.reset = function () {
		delete $cookies.playing;
		delete $cookies.highScore;
		delete self.squares;
		delete self.solution;
		delete self.hints;
		delete self.moves;
	};

	// init restores the board state if there is an active game
	function init () {
		if ($cookies.playing) {
			self.timeDisplay = $cookies.timeDisplay;
			self.guesses = Number($cookies.guesses);
			self.points = Number($cookies.points);
			self.results = $cookies.results.split('_').reduce(function (prev, curr) {
				if (curr.length === 0) {
					return prev;
				} else {
					return prev.concat([Number(curr)]);
				}
			}, []);
			manageState.deStringState(
				$cookies.state, $cookies.solution, $cookies.moves,
				function (squares, solution, moves) {
				setSquares({"board": squares, "path": solution});
				moves.slice(1).forEach(function (move) {
					self.squares[move].click();
				});
			});
			$cookies.timeCheck = Date.now();
			self.countDown();
		}
	}

	
	init();
}]);// end gameController()
},{"../services/manageState.js":"/Users/pcsstudent/Desktop/castlemind/public/app/services/manageState.js"}],"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/mainView.js":[function(require,module,exports){
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
},{}],"/Users/pcsstudent/Desktop/castlemind/public/app/controllers/tutorial.js":[function(require,module,exports){
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
},{"../services/manageState.js":"/Users/pcsstudent/Desktop/castlemind/public/app/services/manageState.js"}],"/Users/pcsstudent/Desktop/castlemind/public/app/services/manageState.js":[function(require,module,exports){

// stringState converts the board data to a pair of strings
function stringState (data, callback) {
	var squares = data.board.reduce( function (prev, curr) {
		return prev + curr.colorKey;
	}, '');
	var solution = data.path.reduce( function (prev, curr, ind) {
		if (ind < data.path.length - 1) {
			return prev + curr.index + curr.direction + curr.solution + '_';
		} else {
			return prev + curr.index;
		}
	}, '');
	callback(squares, solution);
} // end stringState

// deStringState converts strings into the original board data
function deStringState (boardString, solutionString, moveString, callback) {
	var board = [];
	var boardArray = boardString.split('');
	boardArray.forEach(function (elem, ind) {
		var square = {};
		if (ind < 25) {
			square.colorKey = Number(elem);
			square.value = [Math.floor(ind / 5), ind % 5];
			board.push(square);
		}
	});

	var solution = [];
	var solutionArray = solutionString.split('_');
	solutionArray.forEach( function (elem, ind) {
		if (ind < solutionArray.length - 1) {
			var newMove = {};
			newMove.direction = elem.match(/[^\d]+/)[0];
			newMove.index = Number(elem.slice(0,elem.match(/[^\d]+/).index));
			newMove.solution = Number(elem.slice(-1));
		} else {
			var newMove = {};
			newMove.index = Number(elem);
		}
		solution.push(newMove);
	});
	if (moveString.length > 0) {
		var moves = moveString.split('_');
		moves = moves.slice(0,moves.length - 1).map(function(elem){
			return Number(elem)
		});
	} else {
		moves = [];
	}
	callback(board, solution, moves);
} // end deStringState

// resetGuess displays what part of the guess was correct.
// If the guess is only partially correct, it resets the guess.
function resetGuess (moves, hints, squares, solution, guesses, results, callback) {
	// The colors in the hint match the colors on the board
	// Now the colors in the guess and the hint don't line up
	if (moves.length < 6) {
		restart();
	} else if (!moves.some( function (elem, ind) {
		var result = true;
		if (ind === 0) {
			result = false;
		} else if (elem.value === solution[ind - 1].solution) {
			hints[ind].class += " color-" + squares[solution[ind].index].colorKey;
			result = false;
		}
		return result;
	})) {
		results.push(guesses);
		var points = results.reduce( function (prev, curr) {
			if (5 > curr) {
				var newPoints = 5 - curr;
			} else {
				var newPoints = 1;
			}
			return prev + newPoints;
		}, 0);
		message = "You win! You have " + points + ' points!';
	} else {
		restart();
	}
	
	function restart () {
		squares.forEach( function (elem, ind) {
			if (elem.class.indexOf('clicked') !== -1) {
				squares[ind].class = elem.class.split(' ').slice(0, 2).join(' ');
				squares[ind].imgClass = "ng-hide";
			} else if (elem.class.indexOf(' b') !== -1 || elem.class.indexOf(' a') !== -1) {
				squares[ind].class = elem.class.split(' ').slice(0, 3).join(' ');
				squares[ind].imgClass = "ng-hide";
			}
		});
		moves = [];
		message = "Keep trying!";
	}
	callback(moves, hints, squares, message, results, points);
}// end resetGuess

// ****************************************************************** //
// incrementMoves runs when a click even happens and there is more
// room on the moves list.  It
//	...adds a move to the moves list with
//		class: the chosen color
//		value: the associated number
//	...modifies the hits array so that
//		only the current hint has the class currentMove
//	...modifies the following properties of the active square
//		class: hasImage added, clicked added (only if its not first or last)
//		imgClass: ng-hide removed
//		image: hint for next move
// ****************************************************************** //
function incrementMoves (square, hints, moves, squares, callback) {
	var move = {};
	move.class = square.class.split(' highlight').join('');
	move.value = square.colorKey;

	hints = hints.map(function(elem) {
		var result = elem;
		result.class = elem.class.split(' currentMove').join('');
		return result;
	});
	hints[moves.length].class += ' currentMove';

	moves.push(move);
	if (square.class.indexOf(' b') === -1 && square.class.indexOf(' a') === -1) {
		square.class += ' clicked';
	}

	if (square.class.indexOf(' b') === -1) {
		square.class += ' hasImage';
		square.image = hints[moves.length - 1].image;
		square.imgClass = "";
	}
	callback(square, hints, moves, squares);
}// end incrementMoves()

// highlight adds the highlight class to a square if it is a possible move
function highlight (square, index, direction, guessNumber, clickedSquare,
		callback) {
	var toHighlight = [];
	var rowDiff = Math.abs(clickedSquare.value[0] - square.value[0])
	var columnDiff = Math.abs(clickedSquare.value[1] - square.value[1])
	square.class = square.class.split(' highlight').join('');
	if (square.class.indexOf(' hasImage') !== -1) {
		// don't highlight already clicked squares
	} else if (square.class.indexOf(' b') !== -1 && guessNumber < 5) {
		// don't highlight the end square until the end
	} else if(direction === "orthogonal") {
		if ((rowDiff === 1 && columnDiff === 0) || (rowDiff === 0 && columnDiff === 1)) {
			callback(index);
		}
	} else if(direction === "diagonal" && rowDiff === 1 && columnDiff === 1) {
		callback(index);
	} else if(direction === "long orthogonal") {
		if ((rowDiff === 0 && columnDiff === 3) || (rowDiff === 3 && columnDiff === 0)) {
			callback(index);
		}
	} else if(direction === "long diagonal" && rowDiff === 3 && columnDiff === 3) {
		callback(index);
	} else {
		callback('fuck');
	}
}

function makeHint (elem, ind) {
	if (ind === 5) {
		return {"class": 'square b', "imgClass": "ng-hide"};
	} else {
		var string = elem.direction.split(' ').reduce(function (prev, curr) {
			return prev + curr[0];
		}, '');
		var hint = {
				"class": 'square hasImage',
				"image": '../assets/img/' + string + '.png',
				"imgClass": ""
			};

		if (ind === 0) {
			hint.class += ' a';
		}

		return hint;
	}
}

module.exports = {
	stringState: stringState,
	deStringState: deStringState,
	resetGuess: resetGuess,
	incrementMoves: incrementMoves,
	highlight: highlight,
	makeHint: makeHint
}
},{}]},{},["./public/app/index.js"]);
