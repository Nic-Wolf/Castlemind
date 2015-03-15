var initBoard  = require('./makeGame').initBoard;
var resetBoard = require('./makeGame').resetBoard;

window.onload = init;

function init() {
	var divGrid      = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');
	var btnNewGame   = document.getElementById('btnNewGame')
	
	btnNewGame.onclick = function() {
		resetBoard(divUserMoves);
		resetBoard(divGrid);
		
		initBoard();
	};

}//end init()


