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
	// set the color to deal with
	var color = 0;
	// set the list to deal with
	var row = 1;
	// the list of columns that have not been filled
	var columns = [1, 2, 3, 4];
	// make a list of squares in the present row that could be current color
	var possible = [];
	columns.forEach( function (elem) {
		if (seed.some( function (element) {
			return element.value[1] !== elem || element.colorKey !== color;
		}) && color !== row) {
			possible.push(elem);
		}
	})
	console.log('the squares in row 1 that may be color 0 are: ' + possible);
	return seed;
}

console.log(refineBoard(squares));