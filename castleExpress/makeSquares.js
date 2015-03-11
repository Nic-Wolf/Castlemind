var size = 5;
var presentColor = 0;

/**********************************************************************
Set up the board to make a normalized latin square
**********************************************************************/
function initSquares (callback) {
	presentColor = 0;
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

function testInit (callback) {
	presentColor = 0;
	var squares = [];
	var row;
	var col;
	for (row = 0; row < size; row++){
		squares.push(makeSquare([row, 0], row));
	}


	for (col = 1; col < size; col++){
		squares.push(makeSquare([0, col], col));
	}

	squares.push(makeSquare([1,2],0));
	squares.push(makeSquare([2,1],0));
	squares.push(makeSquare([3,3],0));

	callback(squares);
}

// ********************************************************************* //
// The rest of this code should follow this pattern until the latin
// square is complete
// (*) Check for contradictions (checkConsistency)
// 	if no, proceed to (1)
// 	if yes, start the whole thing over.
// (1) Is there only one possible value for this row? (assignColorByRow)
// 	if yes, fill in value and proceed to (a)
// 	if no, proceed to (b)

// 	(a) are there rows left that don't have this color? (checkIfColorDone)
// 	if yes, proceed to (*)
// 	if no, increment color and proceed to (*)
// 	(b) guess square in the present row,
// 		and proceed to (*) (guesser)
// ********************************************************************* //
function completeBoard (seed, callback) {
	if (seed.length === size * size) {
		callback(seed);
	} else {
		checkConsistency (seed, presentColor, callback, function (consistent) {
			if (consistent !== seed) {
				completeBoard(consistent, callback);
			} else {
				checkIfColorDone(seed, presentColor, function (isDone) {
					if (isDone) {	
						presentColor++;
						completeBoard(seed, callback);
					} else {
						refineBoard(seed, presentColor, function (refined) {
							completeBoard(refined, callback);
						});
					}
				});
			}
		});
	}
}

function checkIfColorDone (board, color, callback) {
	var result;
	// this is where I handle (1)(a)
	setPossibles(board, color, function (result) {
		// check if there is no row with possible values
		if (!result.some( function (elem) {
			return elem.length !== 0;
		})) {
			console.log('true');
			callback(true);
		} else {
			callback(false);
		}
	});
}

function checkConsistency (board, color, cb, callback) {
	// this is where I handle (*)
	// determine whether there is a row with no possible column given the
	// present color
	// this conditional is equivalent to:
	// if there exists a row with the following:
	// there is no place for the present color
	// there is no square in the row that is already that color
	setPossibles(board, color, function (result) {
		if(result.some( function (possible, row) {
			return possible.length === 0 && !board.some( function (element) {
				return element.value[0] === row && element.colorKey === color;
			});
		})) {
			// var res = diagnoseProblem(board, color, result);
			// console.log(res);
			// console.log(guesses);
			initSquares (function (squares) {
				callback(squares);
			});
		} else {
			callback(board);
		}
	});
}

function refineBoard (board, color, callback) {
	var newBoard = [].concat(board);

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

function setPossibles (board, color, callback) {
	// possibles contains one array for each row
	// the sub arrays represent the possible values in the given
	// row that could be the given color
	var possibles = [];
	var rows = [];
	var row;
	for (row = 0; row < size; row++) {
		var possible = columnPossible(board, row, color);
		possibles.push(possible);
	}
	callback(possibles);
}

function columnPossible (board, row, color) {
	// columns is the list of all columns
	var columns = [];
	var n;
	for (n = 0; n < size; n++) {
		columns[n] = n;
	}

	// possible is the list of columns in 'row' that could be 'color'
	// for the given board
	var possible = [];
	columns.forEach( function (col) {
		// this conditional checks
		//	that the present square hasn't been assigned
		//	that the current color doens't already exist in the present
		//		column or row
		if (!board.some( function (element) {
			var rowMatch = element.value[0] === row;
			var columnMatch = element.value[1] === col;
			var exactMatch = rowMatch && columnMatch;
			var colorMatch = element.colorKey === color;
			return exactMatch || ((rowMatch || columnMatch) && colorMatch);
		})) {
			// make sure the present row color col combination hasn't already
			// been guessed
			possible.push(col);
		}
	});
	return possible;
}

function assignColorByRow (board, row, color, callback) {
	// if for a given row and a given color there is only one possible
	// column, make a square in that column with that color and push it
	// to the squares array
	// only do this once
	var first = true;
	setPossibles(board, color, function (result) {
		result.forEach( function (elem, index) {
			if (elem.length === 1 && first) {
				board.push(makeSquare([index, elem[0]], color));
				first = false;
			}
		});
	});
	

	callback(board);
}

function guesser (seed, color, callback) {
	// store the old board and make a clone
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
		newGuess.push(makeSquare([row, column], color));
	});
	callback(newGuess);
}

module.exports.completeBoard = completeBoard;
module.exports.testInit = testInit;
module.exports.refineBoard = refineBoard;
module.exports.guesser = guesser;
module.exports.initSquares = initSquares;