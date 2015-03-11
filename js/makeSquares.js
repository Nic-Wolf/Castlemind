var size = 5;
var guesses = {};
var states = {};
var presentColor = 0;

/**********************************************************************
Set up the board to make a normalized latin square
**********************************************************************/
function initSquares (callback) {
	guesses = {};
	states = {};
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

/**********************************************************************
The rest of this code should follow this pattern until the latin
square is complete
(*) Check for contradictions (checkConsistency)
	if no, proceed to (1)
	if yes, proceed to (2)
(1) Is there only one possible value for this row? (assignColorByRow)
	if yes, fill in value and proceed to (a)
	if no, proceed to (b)

	(a) are there rows left that don't have this color? (checkIfColorDone)
	if yes, proceed to (*)
	if no, increment color and proceed to (*)
	(b) store state, guess square in the present row, update guesses,
		and proceed to (*) (guesser)

(2) Have all guesses been made for the last row? (diagnoseProblem)
	if yes, proceed to (a)
	if no, revert and proceed to (*)

	(a) Have all guesses been made for this color? (diagnoseProblem)
	if yes, remove all guesses and states for this color, decrement color,
		revert state to last color, and proceed to (*)
	if no, remove all guesses and states for the last row,
		revert state to last row, and proceed to (*)
**********************************************************************/
function completeBoard (seed, callback) {
	var newBoard;
	checkConsistency (seed, presentColor, function (result) {
		newBoard = result;
	});

	checkIfColorDone(newBoard, presentColor, function (res) {
		if (newBoard.length === size * size) {
			callback(newBoard);
		} else if (res) {	
			presentColor++;
			completeBoard(newBoard, callback);
		} else {
			refineBoard(newBoard, presentColor, function (result) {
				newBoard = result;
			});
			completeBoard(newBoard, callback);
		}
	});
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

function checkConsistency (board, color, callback) {
	var res;
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
			res = diagnoseProblem(board, color, result);
		} else {
			res = board;
		}

		// run the callback on the result regardless
		callback(res);
	});
}

function diagnoseProblem (board, color, possibles) {
	var res;
	// this is where I handle (2)
	// check if there are no possibles left for the last guessed row
	console.log(guesses);
	console.log(color);
	var rows_guessed;
	var last_guessed;
	if (guesses[color]) {
		rows_guessed = Object.keys(guesses[color]);
		last_guessed = Number(getLast(rows_guessed));
	}
	console.log('last_guessed is ' + last_guessed);
	console.log('possibles[last_guessed] is ' + possibles[last_guessed]);
	if (!possibles[last_guessed]) {
		return revertColor(color - 1, function (result) {
			return result;
		});
	} else if (possibles[last_guessed].length === 0) {
		// this is where I handle (a)
		// look at the first state for this color.
		// Check for possibles based on that old state and the current guesses
		var old_state = states[color][rows_guessed[0]][0];
		setPossibles(old_state, color, function (result) {
			// if there are no possibles, then there are no valid guesses left for this color
			// check if there are no rows with possible values
			if (!result.some( function (elem) {
				return elem.length !== 0;
			})) {
				return revertColor(color - 1, function (result) {
					return result;
				});
			} else {
				old_state = getLast(states[color][last_guessed - 1]);
				states[color][last_guessed] = null;
				guesses[color][last_guessed] = null;
				return old_state;
			}
		});
	} else {
		return states[color][row].pop();
	}
}

function revertColor (color, callback) {
	states[color + 1] = null;
	guesses[color + 1] = null;
	presentColor = color;
	if (guesses[color]) {
		var rows_guessed = Object.keys(guesses[color]);
		var old_state = getLast(states[color][getLast(rows_guessed)]);
		return callback(old_state);
	} else {
		return revertColor(color - 1, callback);
	}
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

// return last element of the array
function getLast (array) {
	return array[array.length - 1];
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
	// row that could be the given color
	var possibles = [];
	for (row = 0; row < size; row++) {
		var possible = colunmPossible(board, row, color);
		possibles.push(possible);
	}
	callback(possibles);
}

function colunmPossible (board, row, color) {
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
			if (!guesses[color]) {
				possible.push(col);
			} else if (!guesses[color][row]) {
				possible.push(col);
			} else if (guesses[color][row].indexOf(col) === -1) {
				possible.push(col);
			}
		}
	});
	return possible;
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
		var coordinates = [row, column];
		newGuess.push(makeSquare(coordinates, color));
		// guesses is an object that tracks what guesses have been made
		// the key is the color and the value is an object
		// the key of this object is the row and its value is an array
		// the array should contain all of the previous guesses with the
		// current guess last
		if(!guesses[color]) {
			guesses[color] = {};
			guesses[color][row] = [column];
			states[color] = {};
			states[color][row] = [seed];
		} else if(!guesses[color][row]) {
			guesses[color][row] = [column];
			states[color][row] = [seed];
		} else if (guesses[color][row].indexOf(column) === -1) {
			guesses[color][row].push(column);
			states[color][row].push(seed);
		}
	});
	callback(newGuess, guesses, states);
}
module.exports.completeBoard = completeBoard;
module.exports.refineBoard = refineBoard;
module.exports.guesser = guesser;
module.exports.initSquares = initSquares;