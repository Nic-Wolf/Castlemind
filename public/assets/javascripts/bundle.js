(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/app/index.js":[function(require,module,exports){
'use strict';

var gameBoard = require('./controllers/gameBoard.js');
var tutorial  = require('./controllers/tutorial.js');

// routeApp controlls the different views for this page
var routeApp = angular.module('routeApp', [
  'ngRoute',
  'tutApp',
  'gameApp'
  ]);

routeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: './tutorial',
        controller: 'tutorialController as tCtrl'
      }).
      when('/game', {
        templateUrl: './game',
        controller: 'gameController as gCtrl'
      }).
      otherwise({
        redirectTo: '/game'
      });
  }]);
},{"./controllers/gameBoard.js":"/Users/aaronollis/class/castleMind/castlemind/public/app/controllers/gameBoard.js","./controllers/tutorial.js":"/Users/aaronollis/class/castleMind/castlemind/public/app/controllers/tutorial.js"}],"/Users/aaronollis/class/castleMind/castlemind/public/app/controllers/gameBoard.js":[function(require,module,exports){
var manageState = require('../services/manageState.js');


var gameApp = angular.module('gameApp', ['ngCookies']);

gameApp.controller('gameController', ['$scope', '$http', '$cookies', '$location',
	function($scope, $http, $cookies, $location) {
	var self = this;
	self.results = [];
	self.message = "Welcome! Press New Game to Begin!";
	self.points = 0;

	
	// ******************************************************* //
	// newGame gets a gameboard and path from the server
	// The controller is assigned the following values
	//		squares: the array of squares in the board
	//		solution: the path that the player is trying to guess
	//		moves: the moves that the player has guessed
	//		hints: the values that are displayed to the player
	// ******************************************************* //
	this.newGame = function() {
		self.guesses = 0;
		$cookies.guesses = 0;
		self.message = "You are playing a game! You have " + self.points + " points!";
		$http.get('/api/game').
		success(setSquares).
		error(function(data, status, headers, config){
		});
	}; // end newGame

	this.tutorial = function() {
		$location.path('/');
	}

	// ******************************************************* //
	// setSquares assigns each square a class and a click method
	// The beginning and ending points are given text values
	// The hints are given text values based on the solution
	// ******************************************************* //
	function setSquares (data) {
		$cookies.playing = true;
		manageState.stringState(data, function (state, solution) {
			$cookies.state = state;
			$cookies.solution = solution;
		});

		self.messageClass = 'glow';
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
		
		self.hints = self.solution.map(function (elem, ind) {
			if (ind === 5) {
				return {"class": 'square b', "imgClass": "ng-hide"};
			} else {
				var string = elem.direction.split(' ').reduce(function (prev, curr) {
					return prev + curr[0];
				}, '');
				return {
					"class": 'square hasImage',
					"image": '../assets/img/' + string + '.png',
					"imgClass": ""
				};
				}
		});
		self.hints[0].class = 'square hasImage a';
		
		self.squares[self.solution[0].index].class += ' a';
		self.squares[self.solution[0].index].click();
	} // end setSquares

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

		var direction = self.solution[self.moves.length -1].direction
		var thisy = this;
		var legalMoves = false;
		self.squares.forEach(function (square, index) {
			manageState.highlight(square, index, direction, self.moves.length, thisy);
			if (square.class.indexOf(' highlight') !== -1) {
				legalMoves = true;
			}
		});

		if (self.moves.length === 6) {
			$cookies.guesses = self.guesses;
			manageState.resetGuess(
				self.moves, self.hints, self.squares, self.solution, self.guesses,
				self.results, function(moves, hints, squares, message, results, points) {
					self.moves = moves;
					self.hints = hints;
					self.squares = squares;
					self.message = message;
					self.results = results;
					self.points = points;
					if (moves.length === 0) {
						self.guesses++;
						$cookies.moves = '';
						self.squares = self.squares.map(function (elem) {
							var result = elem;
							result.click = click;
							return result;
						})
						self.squares[self.solution[0].index].click();
					}

					else {
						self.messageClass = 'theMessage';
					}
				}
			);
		} else if (!legalMoves) {
			self.cancel();
			self.message = "Oops! You had nowhere to go.";
		}

	} // end click()

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
		delete self.squares;
		delete self.solution;
		delete self.hints;
		delete self.moves;
	}

	// init restores the board state if there is an active game
	function init () {
		if ($cookies.playing) {
			self.guesses = $cookies.guesses;
			manageState.deStringState(
				$cookies.state, $cookies.solution, $cookies.moves,
				function (squares, solution, moves) {
				setSquares({"board": squares, "path": solution});
				moves.slice(1).forEach(function (move) {
					self.squares[move].click();
				})
			});
		}
	}

	
	init();
}]);// end gameController







































},{"../services/manageState.js":"/Users/aaronollis/class/castleMind/castlemind/public/app/services/manageState.js"}],"/Users/aaronollis/class/castleMind/castlemind/public/app/controllers/tutorial.js":[function(require,module,exports){
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
},{}],"/Users/aaronollis/class/castleMind/castlemind/public/app/services/manageState.js":[function(require,module,exports){

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
		console.log(elem);
		if (ind < solutionArray.length - 1) {
			var newMove = {};
			newMove.direction = elem.match(/[^\d]+/)[0];
			newMove.index = Number(elem.slice(0,elem.match(/[^\d]+/).index));
			newMove.solution = Number(elem.slice(-1));
		} else {
			var newMove = {};
			newMove.index = Number(elem);
		}
		console.log(newMove);
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
function highlight (square, index, direction, guessNumber, clickedSquare) {
	var rowDiff = Math.abs(clickedSquare.value[0] - square.value[0])
	var columnDiff = Math.abs(clickedSquare.value[1] - square.value[1])
	square.class = square.class.split(' highlight').join('');
	if (square.class.indexOf(' hasImage') !== -1) {
		// don't highlight already clicked squares
	} else if (square.class.indexOf(' b') !== -1 && guessNumber < 5) {
		// don't highlight already clicked squares
	} else if(direction === "orthogonal") {
		if ((rowDiff === 1 && columnDiff === 0) || (rowDiff === 0 && columnDiff === 1)) {
			square.class += ' highlight';
		}
	} else if(direction === "diagonal" && rowDiff === 1 && columnDiff === 1) {
		square.class += ' highlight';

	} else if(direction === "long orthogonal") {
		if ((rowDiff === 0 && columnDiff === 3) || (rowDiff === 3 && columnDiff === 0)) {
			square.class += ' highlight';
		}
	} else if(direction === "long diagonal" && rowDiff === 3 && columnDiff === 3) {
		square.class += ' highlight';

	}
}

module.exports = {
	stringState: stringState,
	deStringState: deStringState,
	resetGuess: resetGuess,
	incrementMoves: incrementMoves,
	highlight: highlight
}
},{}]},{},["./public/app/index.js"]);
