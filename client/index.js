var initBoard  = require('./makeGame').initBoard;
var resetBoard = require('./makeGame').resetBoard;

var gameApp = angular.module('gameApp', []);

gameApp.controller('gameController', ['$http', function($http) {

	this.message = 'hello';

	var divGrid      = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');
	var btnNewGame   = document.getElementById('btnNewGame')
	
	this.newGame = function() {
		var solution;
		var squares;
		var self = this;
		resetBoard(divUserMoves);
		resetBoard(divHints);
		resetBoard(divGrid);
		$http.get('/api/game').
		success(setSquares).
		error(function(data, status, headers, config){
			console.log(data);
		});

		function setSquares (data, status, headers, config) {
			console.log(self);
			solution = data.path;
			self.squares = data.board;
			self.squares = self.squares.map(function (elem) {
				var result = elem;
				result.class = "square color-" + elem.colorKey;
				return result;
			});
			self.squares[solution[0].index].textContent = 'A';
			self.squares[solution[solution.length - 1].index].textContent = 'B';
		}
		// initBoard();
	};

}]);// end gameController

