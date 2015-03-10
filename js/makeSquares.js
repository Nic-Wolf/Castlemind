var size = 5;
var guesses = {};
var states = [];
var presentColor = 0;

function initSquares (callback) {
	guesses = {};
	states = [];
	var squares = [];
	var row;
	var col;
	for (row = 0; row < size; row++){
		squares.push(makeSquare([row, 0], row));
	}


	for (col = 1; col < size; col++){
		squares.push(makeSquare([0, col], col));
	}

	callback(squares);
}

function completeBoard (seed) {
	console.log(guesses);
	var newBoard;
	checkConsistency (seed, presentColor, function (result) {
		newBoard = result;
	});
	refineBoard(seed, presentColor, function (result) {
		newBoard = result;
	});

	return newBoard;
}

function checkConsistency (board, color, callback) {
	var consistent = true;
	// determine whether there is a row with no possible column for the
	// present color
	// set consistent to false if there exists a row with the following:
	// there is no place for the present color
	// there is no square in the row that is already that color
	setPossibles(board, color, function (result) {
		if(result.some( function (possible, row) {
			return possible.length === 0 && !board.some( function (element) {
				return element.value[0] === row && element.colorKey === color;
			});
		})) {
			consistent = false;
		}
	});

	// if the board is consistent, pass the board to the callback.
	// otherwise, revert to the previous board state
	if (consistent) {
		callback(board);
	} else {
		callback(states.pop());
	}
}

function refineBoard (board, color, callback) {
	var newBoard = board;

	assignColorByRow(newBoard, 0, color, function (result) {
		newBoard = result;
	});

	if (newBoard.length === board.length) {
		guesser(newBoard, color, function (result) {
			newBoard = result;
		});
	}
	
	callback(newBoard);
}

// returns random value from {0,...,num - 1}
function randInt (num) {
	return Math.floor(Math.random() * num);
}

function makeSquare (coordinates, color) {
	var square = {};
	square.value = coordinates;
	square.colorKey = color;
	return square;
}

function assignColorByRow (board, row, color, callback) {
	// if for a given row and a given color there is only one possible
	// column, make a square in that column with that color and push it
	// to the squares array
	setPossibles(board, color, function (result) {
		result.forEach( function (elem, index) {
			if (elem.length === 1) {
				board.push(makeSquare([index, elem[0]], color));
			}
		});
	});

	callback(board);
}

function setPossibles (board, color, callback) {
	// possibles contains one array for each row
	// the sub arrays represent the possible values in the given
	var possibles = [];
	// row that could be the given color
	for (row = 0; row < size; row++) {
		var possible = colunmPossible(board, row, color);
		// console.log('the squares in row ' + row + ' that may be color ' + color + ' are: ' + possible);
		possibles.push(possible);
	}
	callback(possibles);
}

function colunmPossible (board, row, color) {
	// columns is the list of columns
	var columns = [];
	var n;
	for (n = 0; n < size; n++) {
		columns[n] = n;
	}

	// possible is the list of columns in 'row' that could be 'color'
	// for the given board
	var possible = [];
	columns.forEach( function (col) {
		if (!board.some( function (element) {
			var rowMatch = element.value[0] === row;
			var columnMatch = element.value[1] === col;
			var exactMatch = rowMatch && columnMatch;
			var colorMatch = element.colorKey === color;
			return exactMatch || ((rowMatch || columnMatch) && colorMatch);
		})) {
			// check the list of guesses before pushing the col
			if (!guesses[[row, col]]) {
				possible.push(col);
			} else if (guesses[[row, col]].indexOf(color) === -1) {
				possible.push(col);
			} else if (false) {
				console.log('caught old guess for color ' + color + ' and coordinates ' + [row, col]);
				console.log(guesses)
			}
		}
	});
	return possible;
}

function guesser (seed, color, callback) {
	// store the old board and make a clone
	states.push(seed);
	var newGuess = JSON.parse(JSON.stringify(seed));

	// determine what possibilities remain for the present color
	setPossibles(newGuess, color, function (result) {
		// determine the first row that doesn't have the color yet
		var row;
		result.some(function (elem, index) {
			row = index;
			return elem.length > 0;
		});
		// randomly assign the color to one of the squares in the row
		var randomValue = randInt(result[row].length);
		var column = result[row][randomValue];
		var coordinates = [row, column];
		newGuess.push(makeSquare(coordinates, color));
		if(!guesses[coordinates]) {
			guesses[coordinates] = [color];
		} else if (guesses[coordinates].indexOf(color) === -1) {
			guesses[coordinates].push(color);
		}
	});
	callback(newGuess, guesses, states);
}
module.exports.completeBoard = completeBoard;
module.exports.refineBoard = refineBoard;
module.exports.guesser = guesser;
module.exports.initSquares = initSquares;