var gameApp = angular.module('gameApp', ['ngCookies']);

gameApp.controller('gameController', ['$http', '$cookies', function($http, $cookies) {
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
	}; // end newGame

	// ******************************************************* //
	// setSquares assigns each square a class and a click method
	// The beginning and ending points are given text values
	// The hints are given text values based on the solution
	// ******************************************************* //
	function setSquares (data) {
		$cookies.playing = true;
		stringState(data, function (state, solution) {
			$cookies.state = state;
			$cookies.solution = solution;
		});

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

			resetGuess(self.moves, self.hints, self.squares, self.solution,
				function(moves, hints, squares, message) {

				self.moves = moves;
				self.hints = hints;
				self.squares = squares;
				self.message = message;
			});
		}
	}

	function init () {
		if ($cookies.playing) {
			deStringState($cookies.state, $cookies.solution, function (squares, solution) {
				setSquares({"board": squares, "path": solution});
			});
		}
	}

	init();
}]);// end gameController

function stringState (data, callback) {
	var squares = data.board.reduce( function (prev, curr) {
		return prev + curr.colorKey;
	}, '');
	var solution = data.path.reduce( function (prev, curr, ind) {
		if (ind < data.path.length - 1) {
			return prev + curr.index + curr.direction + curr.solution + '#';
		} else {
			return prev + curr.index;
		}
	}, '');
	callback(squares, solution);
}

function deStringState (boardString, solutionString, callback) {
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
	var solutionArray = solutionString.split('#');
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
	callback(board, solution);
}

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