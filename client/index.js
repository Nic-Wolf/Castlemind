var initBoard  = require('./makeGame').initBoard;
var resetBoard = require('./makeGame').resetBoard;

var gameApp = angular.module('gameApp', []);

gameApp.controller('gameController', function() {
	this.message = 'hello';

window.onload = init;

function init() {
	var divGrid      = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');
	var btnNewGame   = document.getElementById('btnNewGame')
	
	btnNewGame.onclick = function() {
		resetBoard(divUserMoves);
		resetBoard(divHints);
		resetBoard(divGrid);
		
		initBoard();
	};

}//end init()

});// end gameController

