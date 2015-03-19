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

		console.log(self.squares);

		self.squares[self.solution[0].index].textContent = 'A';
		self.squares[self.solution[0].index].class += ' a';
		delete self.squares[self.solution[0].index].click;

		self.squares[self.solution[self.solution.length - 1].index].class += ' b';
		self.moves = [];
		$cookies.moves = '';
		
		self.hints = self.solution.slice(0, 5).map(function (elem) {
			var string = elem.direction.split(' ').reduce(function (prev, curr) {
				return prev + curr[0];
			}, '');
			return {"class": 'square', "image": '../img/' + string + '.png'};
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
		$cookies.moves += self.squares.indexOf(this) + '#';
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

		// self.squares.forEach(function(square, index) {
		// 	var direction = self.solution[self.moves.length].direction
		// //not sure how to account for every row/column of each square array, just have it set for 0 and 1//
		// 	var rowDif = math.abs(this.value.[0] - square.value[0])
		// 	var columnDiff = math.abs(this.value[1] - square.value[1])

		// 		if(direction === "orthogonal", rowDif = 1, columnDiff = 1) {
		// 			self.squares.highlight(coordinates of square);

	

		// 		}

		// 		if(direction === "diagonal", rowDif = 1, columnDiff = 1) {
		// 			self.squares.highlight(coordinates of square);

		// 		}

		// 		if(direction === "orthogonal", rowDif = 3, columnDiff = 3) {

		// 		}

		// 		if(direction === "diagonal", rowDif = 3, columnDiff = 3){

		// 		}
		// });

	}

	this.reset = function () {
		delete $cookies.playing;
		delete self.squares;
		delete self.solution;
		delete self.hints;
		delete self.moves;
	}

	function init () {
		if ($cookies.playing) {
			manageState.deStringState(
				$cookies.state, $cookies.solution, $cookies.moves,
				function (squares, solution, moves) {
				setSquares({"board": squares, "path": solution});
				moves.forEach(function (move) {
					self.squares[move].click();
				})
			});
		}
	}

	init();
}]);// end gameController
