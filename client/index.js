var manageState = require('./manageState.js');

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
		manageState.stringState(data, function (state, solution) {
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

		console.log(self.squares);

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

			manageState.resetGuess(
				self.moves, self.hints, self.squares, self.solution,
				function(moves, hints, squares, message) {

				self.moves = moves;
				self.hints = hints;
				self.squares = squares;
				self.message = message;
			});
		}

		self.squares.forEach(function(square, index) {
			var direction = self.solution[self.moves.length].direction
				if(direction === "original") {
					var rowDif = math.abs(this.value.{0} - square.value[0])
				}
		});


	}







// //highlight function, have to decide if it should simply insert a color or image etc...//	

// 		function highlight () {
// 			$(".square").value.change(function() {
// 				$(".square").value = background-color: #FFO;
// 			});
				
// 		}

// 		if(user has clicked) {
// 				$(".square").select(function() {
// 				$(".square").value.highlight();
// 				});
// 		}

// //also make a function to remove highlight//
// 		function removeHighlight () {
// 			var originalColor = get original square value when board was first generated
// 			$(".square").value.change(function() {
// 			$(".square").value = originalColor;
// 		});
// 		}

// 		if(board is reset) {
// 			$(".square").select(function() {
// 			$(".square").value.removeHighlight();
// 			});
// 		};		
// 	}




		
	

	function init () {
		if ($cookies.playing) {
			manageState.deStringState(
				$cookies.state, $cookies.solution, function (squares, solution) {
				setSquares({"board": squares, "path": solution});
			});
		}
	}

	init();
}]);// end gameController