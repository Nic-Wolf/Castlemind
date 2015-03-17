var gameApp = angular.module('gameApp', []);

gameApp.controller('gameController', ['$http', function($http) {
	var self = this;

	this.message = 'hello';

	var divGrid      = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');
	var btnNewGame   = document.getElementById('btnNewGame');
	
	this.newGame = function() {
		var solution;
		var squares;
		self.message = "You are playing a game!";
		$http.get('/api/game').
		success(setSquares).
		error(function(data, status, headers, config){
			console.log(data);
		});

		function setSquares (data, status, headers, config) {
			self.solution = data.path;
			squares = data.board;
			squares = squares.map(function (elem) {
				var result = elem;
				result.class = "square color-" + elem.colorKey;
				result.clicker = clicker;
				return result;
			});
			squares[self.solution[0].index].textContent = 'A';
			squares[self.solution[self.solution.length - 1].index].textContent = 'B';
			self.squares = squares;
			self.moves = [];
			self.hints = self.solution.slice(0, 5).map(function (elem) {
				var string = elem.direction.split(' ').reduce(function (prev, curr) {
					return prev + curr[0];
				}, '');
				return {textContent: string, "class": 'square'};
			});
		}
	};

	function clicker () {
		
		var move = {};
		move.class = this.class;
		move.value = Number(this.class[this.class.length - 1]);
		self.moves.push(move);
		this.class += ' clicked';

		if (self.moves.length === 5) {
			self.squares.forEach( function (elem, ind) {
				if (elem.class.split(' ').indexOf('clicked') !== -1) {
					self.squares[ind].class = elem.class.split(' ').slice(0, 2).join(' ');
				}
			});
			if (!self.moves.some( function (elem, ind) {
				var result = elem.value !== self.solution[ind].solution;
				if (!result) {
					console.log('guess was ' + elem.value);
					console.log('solution was ' + self.solution[ind].solution);
					self.hints[ind].class = self.squares[self.solution[ind + 1].index].class;
				}
				return result;
			})) {
				self.message = "You win!";
			} else {
				self.message = "Keep trying!";
			}
			self.moves = [];
		}
	}

}]);// end gameController

