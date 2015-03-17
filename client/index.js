var gameApp = angular.module('gameApp', []);

gameApp.controller('gameController', ['$http', function($http) {
	var self = this;

	this.message = 'hello';
	
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
			console.log(data);
		});

		// ******************************************************* //
		// setSquares assigns each square a class and a click method
		// The beginning and ending points are given text values
		// The hints are given text values based on the solution
		// ******************************************************* //
		function setSquares (data) {
			self.solution = data.path;
			self.squares = data.board.map(function (elem) {
				var result = elem;
				result.class = "square color-" + elem.colorKey;
				result.click = click;
				return result;
			});
			self.squares[self.solution[0].index].textContent = 'A';
			self.squares[self.solution[0].index].class += ' a';
			delete self.squares[self.solution[0].index].click;
			self.squares[self.solution[self.solution.length - 1].index].textContent = 'B';
			self.squares[self.solution[self.solution.length - 1].index].class += ' b';
			self.moves = [];
			self.hints = self.solution.slice(0, 5).map(function (elem) {
				var string = elem.direction.split(' ').reduce(function (prev, curr) {
					return prev + curr[0];
				}, '');
				return {textContent: string, "class": 'square'};
			});
		} // end setSquares
	}; // end newGame

	// click adds a new object to moves and changes the class of the clicked square.
	// If all the moves have been made, run resetGuess.
	function click () {
		var move = {};
		move.class = this.class;
		move.value = Number(this.class.split('-')[1][0]);
		self.moves.push(move);
		if (this.class.indexOf(' b') === -1) {
			this.class += ' clicked';
		}

		if (self.moves.length === 5) {

			resetGuess(self.moves, self.hints, self.squares, self.solution,
				function(moves, hints, squares, message) {

				self.moves = moves;
				self.hints = hints;
				self.squares = squares;
				self.message = message;
			});
		}
	}
}]);// end gameController

// resetGuess displays what part of the guess was correct.
// If the guess is only partially correct, it resets the guess.
function resetGuess (moves, hints, squares, solution, callback) {
	squares.forEach( function (elem, ind) {
		if (elem.class.indexOf('clicked') !== -1) {
			squares[ind].class = elem.class.split(' ').slice(0, 2).join(' ');
		}
	});
	if (!moves.some( function (elem, ind) {
		var result = elem.value !== solution[ind].solution;
		if (!result) {
			hints[ind].class = squares[solution[ind + 1].index].class;
		}
		return result;
	})) {
		message = "You win!";
	} else {
		moves = [];
		message = "Keep trying!";
	}
	callback(moves, hints, squares, message);
}// end resetGuess

