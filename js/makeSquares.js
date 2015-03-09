var size = 5;
var guesses = {};
var states = [];
var presentColor = 0;

// returns random value from {0,...,num - 1}
function randInt (num) {
	return Math.floor(Math.random() * num);
}

function initSquares (callback) {
	guesses = {};
	states = [];
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

function refineBoard (seed, callback) {
	var initial = seed.length;
	var newBoard = seed;

	assignColorByRow(0, presentColor);

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

	if (newBoard.length === initial && newBoard.length < 13) {
		guesser(newBoard, presentColor, function (result) {
			newBoard = result;
		});
		refineBoard(newBoard, callback);
	} else {
		console.log(newBoard);
		callback(newBoard);
	}
}

function setPossibles (seed, color, callback) {
	// possibles contains one array for each row
	// the sub arrays represent the possible values in the given
	var possibles = [];
	// row that could be the given color
	for (row = 0; row < size; row++) {
		var possible = colunmPossible(seed, row, color);
		// console.log('the squares in row ' + row + ' that may be color ' + color + ' are: ' + possible);
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
			return exactMatch || ((firstMatch || secondMatch) && element.colorKey === color);
		})) {
			possible.push(col);
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
		makeSquare(coordinates, color, function (res) {
			newGuess.push(res);
			guesses[coordinates] = color;
		});
	});
	callback(newGuess, guesses, states);
}

function completeBoard (seed) {
	return seed;
}
module.exports.completeBoard = completeBoard;
module.exports.refineBoard = refineBoard;
module.exports.guesser = guesser;
module.exports.initSquares = initSquares;