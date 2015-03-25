var manageState = require('../services/manageState.js');

var gameApp = angular.module('gameApp', ['ngCookies']);

gameApp.controller('gameController', ['$http', '$cookies', '$location', '$timeout',
	function($http, $cookies, $location, $timeout) {
	var self = this;
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
					self.timeDisplay = 'Time remaining: ' + (4 - minutes) + ':' + (59 - seconds);
				} else {
					self.timeDisplay = 'Time remaining: ' + (4 - minutes) + ':0' + (59 - seconds);
				}
				self.countDown();
			} else {
				self.timeDisplay = 'Time remaining: 0:00';
			}
			$cookies.timeDisplay = self.timeDisplay;
		}, 500);
	}
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
		if (!$cookies.playing || self.timeDisplay === 'Time remaining: 0:00') {
			$cookies.timeCheck = Date.now();
			$cookies.elapsedTime = 0;
			self.timeDisplay = 'Time remaining: 5:00';
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

		var direction = self.solution[self.moves.length -1].direction
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
					} else {
						$cookies.victory = true;
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
			$cookies.timeCheck = Date.now();
			self.timeDisplay = $cookies.timeDisplay;
			self.countDown();
		}
	}

	init();
}]);// end gameController
