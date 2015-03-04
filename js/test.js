function initSquares (callback) {
	var squares = [];
	var row;
	var col;
	for (row = 0; row < 5; row++){
		makeSquare([row, 0], row, function (result) {
			squares.push(result);
		});
	}


	for (col = 1; col < 5; col++){
		makeSquare([0, col], col, function (result) {
			squares.push(result);
		});
	}

	callback(squares);
}

function makeSquare (coordinates, color, callback) {
	var square = {};
	square.value = coordinates;
	square.colorKey = color;
	callback(square);
}


var squares;
initSquares(function (result) {
	squares = result;
});

function refineBoard (seed) {
	return seed;
}

console.log(refineBoard(squares));