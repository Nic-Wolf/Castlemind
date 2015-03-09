var size = 5;
var guesses = {};
var states = [];

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

function refineBoard (seed) {
	var initial = seed.length;
	var newBoard = seed;

	assignColorByRow(0, 0);

	function assignColorByRow (row, color) {
		// if for a given row and a given color there is only one possible
		// column, make a square in that column with that color and push it
		// to the squares array
		setPossibles(seed, color, function (result) {
			result.forEach( function (elem, index) {
				if (elem.length === 1) {
					makeSquare([index, elem[0]], color, function (result) {
						newBoard.push(result);
					});
				}
			});
		});
	}

	return newBoard;
}

function setPossibles (seed, color, callback) {
	// possibles contains one array for each row
	// the sub arrays represent the possible values in the given
	var possibles = [];
	// row that could be the given color
	for (row = 0; row < size; row++) {
		var possible = colunmPossible(seed, row, color);
		console.log('the squares in row ' + row + ' that may be color ' + color + ' are: ' + possible);
		possibles.push(possible);
	}
	callback(possibles);
}

function colunmPossible (seed, row, color) {
	// columns is the list of columns
	var columns = [];
	var n;
	for (n = 0; n < size; n++) {
		columns[n] = n;
	}

	// possible is the list of columns in 'row' that could be 'color'
	// for the given seed
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

function guesser (seed, color, callback) {
	states.push(seed);
	var newGuess = JSON.parse(JSON.stringify(seed));
	callback(newGuess, guesses, states);
}

function completeBoard (seed) {
	return seed;
}
module.exports.completeBoard = completeBoard;
module.exports.refineBoard = refineBoard;
module.exports.guesser = guesser;
module.exports.initSquares = initSquares;