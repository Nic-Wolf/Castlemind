var manageState = require('./manageState.js');

var gameApp = angular.module('gameApp', ['ngCookies']);


gameApp.controller('gameController', ['$http', '$cookies', '$location',
	function($http, $cookies, $location) {
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
		console.log(self.solution);
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
		
		self.hints = self.solution.slice(0, 5).map(function (elem) {
			var string = elem.direction.split(' ').reduce(function (prev, curr) {
				return prev + curr[0];
			}, '');
			return {"class": 'square hasImage', "image": './img/' + string + '.png'};
		});
		self.hints[0].class = 'square hasImage a';
		
		self.squares[self.solution[0].index].class += ' a';
		self.squares[self.solution[0].index].click();
		console.log(self.hints);
	} // end setSquares

	// ************************************************************************* //
	// click has three main parts
	//	if there is room in the moves array, run increment moves
	//	highlight only the squares that are possible moves
	//	if the guess is complete, check the solution
	// ************************************************************************* //
	function click () {
		console.log($cookies.moves);
		
		if (self.moves.length < 5) {
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
		self.squares.forEach(highlight);

		// highlight adds the highlight class to a square if it is a possible move
		function highlight (square, index) {
			var rowDiff = Math.abs(thisy.value[0] - square.value[0])
			var columnDiff = Math.abs(thisy.value[1] - square.value[1])
			square.class = square.class.split(' highlight').join('');

			if(direction === "orthogonal") {
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

		if (self.moves.length === 5 && this.class.indexOf(' b') !== -1) {

			manageState.resetGuess(
				self.moves, self.hints, self.squares, self.solution,
				function(moves, hints, squares, message) {
					self.moves = moves;
					self.hints = hints;
					self.squares = squares;
					self.message = message;
					if (moves.length === 0) {
						console.log('clicking');
						$cookies.moves = '';
						self.squares[self.solution[0].index].click();
					}
				}
			);
		}

	}

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
