var manageState = require('../services/manageState.js');


var gameApp = angular.module('gameApp', ['ngCookies']);
	
gameApp.controller('gameController', ['$http', '$cookies', '$location', '$timeout',
	function($http, $cookies, $location, $timeout) {
	var self = this;
	self.hideAlert = true;
	self.killAlert = function () {
		self.hideAlert = true;
	}
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
				self.message = "Game Over!\nYour final score is: " + self.points + "!";
				self.hideAlert = false;
			}
			$cookies.timeDisplay = self.timeDisplay;
		}, 500);
	}; // end countDown()
	self.message = "Welcome! Press New Game to Begin!";


	// ******************************************************* //
	// newGame
	// ******************************************************* //
	this.newGame = function() {
		this.reset();
		this.newBoard();
	}
	
	// ******************************************************* //
	// newBoard starts the timer and gets a gameboard and path from the server
	// The controller is assigned the following values
	//		timeDisplay: shows the player their remaining time
	//		points: this reflects the running total for five minutes
	//		squares: the array of squares in the board
	//		solution: the path that the player is trying to guess
	//		moves: the moves that the player has guessed
	//		hints: the values that are displayed to the player
	// ******************************************************* //
	this.newBoard = function() {
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
						self.hideAlert = false;
						if (self.points > self.highScore) {
							self.highScore = self.points;
							$cookies.highScore = self.highScore;
						}
					}
				}
			);
		} else if (toHighlight.length === 0) {
			self.cancel();
			self.guesses++;
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
		self.message = "Welcome to Castlemind!\nTry to figure out the secret path to the castle!\nClick New Game to Start!";
		self.hideAlert = false;
	}

	
	init();
}]);// end gameController()