var size = 5;

function initSquares (callback) {
	var squares = [];
	var row;
	var col;
	for (row = 0; row < size; row++){
		makeSquare([row, 0], row, function (result) {
			squares.push(result);
		});
	}


	for (col = 1; col < size; col++){
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
	var color = 3;
	// set the list to deal with
	var row;
	var possibles = [];
	for (row = 0; row < size; row++) {
		var possible = colunmPossible(seed, row, color);
		console.log('the squares in row ' + row + ' that may be color ' + color + ' are: ' + possible);
		possibles.push(possible);
	}
	// make a list of squares in the present row that could be current color
	return seed;
}

function colunmPossible (seed, row, color) {
	// the list of columns that have not been filled
	var columns = [];
	var n;
	for (n = 0; n < size; n++) {
		columns[n] = n;
	}
	var possible = [];
	columns.forEach( function (col) {
		if (!seed.some( function (element) {
			var firstMatch = element.value[0] === row;
			var secondMatch = element.value[1] === col;
			var exactMatch = firstMatch && secondMatch;
			return exactMatch || (secondMatch && element.colorKey === color);
		})) {
			possible.push(col);
		}
	});
	return possible;
}

console.log(refineBoard(squares));