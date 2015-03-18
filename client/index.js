var manageState = require('./manageState.js');

var gameApp = angular.module('gameApp', ['ngCookies']);

gameApp.controller('gameController', ['$http', '$cookies', function($http, $cookies) {
	var self = this;

	this.message = "Welcome! Press New Game to Begin!";
	
	// ******************************************************* //
	// newGame gets a gameboard and path from the server
	// The controller is assigned the following values
	//		squares: the array of squares in the board
	//		solution: the path that the player is trying to guess
	//		moves: the moves that the player has guessed
	//		hints: the values that are displayed to the player
	// ******************************************************* //
	this.newGame = function() {
		self.message = "You are playing a game!";
		$http.get('/api/game').
		success(setSquares).
		error(function(data, status, headers, config){
		});
	}; // end newGame

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
		console.log(self.solution);
		self.squares = data.board.map(function (elem) {
			var result = elem;
			result.class = "square color-" + elem.colorKey;
			result.click = click;
			return result;
		});
		
		self.squares[self.solution[0].index].class += ' a';
		delete self.squares[self.solution[0].index].click;

		self.squares[self.solution[self.solution.length - 1].index].class += ' b';
		self.moves = [];
		
		self.hints = self.solution.slice(0, 5).map(function (elem) {
			var string = elem.direction.split(' ').reduce(function (prev, curr) {
				return prev + curr[0];
			}, '');
			return {"class": 'square ' + string};
		});
		console.log(self.hints);
	} // end setSquares

	// click adds a new object to moves and changes the class of the clicked square.
	// If all the moves have been made, run resetGuess.
	function click () {
		var move = {};
		move.class = this.class;
		move.value = this.colorKey;
		self.moves.push(move);
		if (this.class.indexOf(' b') === -1) {
			this.class += ' clicked';
		}

		if (self.moves.length === 5) {

			manageState.resetGuess(
				self.moves, self.hints, self.squares, self.solution,
				function(moves, hints, squares, message) {
					self.moves = moves;
					self.hints = hints;
					self.squares = squares;
					self.message = message;
				}
			);
		}
	}

	function init () {
		if (false/*$cookies.playing*/) {
			manageState.deStringState(
				$cookies.state, $cookies.solution, function (squares, solution) {
				setSquares({"board": squares, "path": solution});
			});
		}
	}

	init();
}]);// end gameController
