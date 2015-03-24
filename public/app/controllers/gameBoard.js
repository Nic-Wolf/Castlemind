var manageState = require('../services/manageState.js');


var gameApp = angular.module('gameApp', ['ngCookies']);

gameApp.controller('gameController', ['$http', '$cookies', '$location',
	function($http, $cookies, $location) {
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

// 	function animate() {

// 		.directive('shakeThat', ['$animate', function($animate) {

// 		  return {
// 		    require: '^form',
// 		    scope: {
// 		      submit: '&',
// 		      submitted: '='
// 		    },

//     // Need to figure out how to tie to squares properly //

//     squares: function(scope, element, attrs, form) {
//       // listen on submit event
//       element.on('submit', function() {
//         // tell angular to update scope
//         scope.$apply(function() {
//           // everything ok -> call submit fn from controller
//           if (form.$valid) return scope.submit();
//           // show error messages on submit
//           scope.submitted = true;
//           // shake that form
//           $animate.addClass(element, 'shake', function() {
//             $animate.removeClass(element, 'shake');
//           });
//         });
//       });
//     }
//   };

// }]);	
	
	init();
}]);// end gameController






































