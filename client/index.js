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
			solution = data.path;
			squares = data.board;
			squares = squares.map(function (elem) {
				var result = elem;
				result.class = "square color-" + elem.colorKey;
				result.clicker = function () {
					this.class += ' clicked';
				};
				return result;
			});
			squares[solution[0].index].textContent = 'A';
			squares[solution[solution.length - 1].index].textContent = 'B';
			self.squares = squares;
		}
		// initBoard();
	};

}]);// end gameController

