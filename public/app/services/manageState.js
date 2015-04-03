
// stringState converts the board data to a pair of strings
function stringState (data, callback) {
	var squares = data.board.reduce( function (prev, curr) {
		return prev + curr.colorKey;
	}, '');
	var solution = data.path.reduce( function (prev, curr, ind) {
		if (ind < data.path.length - 1) {
			return prev + curr.index + curr.direction + curr.solution + '_';
		} else {
			return prev + curr.index;
		}
	}, '');
	callback(squares, solution);
} // end stringState

// deStringState converts strings into the original board data
function deStringState (boardString, solutionString, moveString, callback) {
	var board = [];
	var boardArray = boardString.split('');
	boardArray.forEach(function (elem, ind) {
		var square = {};
		if (ind < 25) {
			square.colorKey = Number(elem);
			square.value = [Math.floor(ind / 5), ind % 5];
			board.push(square);
		}
	});

	var solution = [];
	var solutionArray = solutionString.split('_');
	solutionArray.forEach( function (elem, ind) {
		if (ind < solutionArray.length - 1) {
			var newMove = {};
			newMove.direction = elem.match(/[^\d]+/)[0];
			newMove.index = Number(elem.slice(0,elem.match(/[^\d]+/).index));
			newMove.solution = Number(elem.slice(-1));
		} else {
			var newMove = {};
			newMove.index = Number(elem);
		}
		solution.push(newMove);
	});
	if (moveString.length > 0) {
		var moves = moveString.split('_');
		moves = moves.slice(0,moves.length - 1).map(function(elem){
			return Number(elem)
		});
	} else {
		moves = [];
	}
	callback(board, solution, moves);
} // end deStringState

// resetGuess displays what part of the guess was correct.
// If the guess is only partially correct, it resets the guess.
function resetGuess (moves, hints, squares, solution, guesses, results, callback) {
	// The colors in the hint match the colors on the board
	// Now the colors in the guess and the hint don't line up
	if (!moves.some( function (elem, ind) {
		var result = true;
		if (ind === 0) {
			result = false;
		} else if (elem.value === solution[ind - 1].solution) {
			hints[ind].class += " color-" + squares[solution[ind].index].colorKey;
			result = false;
		}
		return result;
	}) && moves.length === 6) {
		results.push(guesses);
		var points = results.reduce( function (prev, curr) {
			if (5 > curr) {
				var newPoints = 5 - curr;
			} else {
				var newPoints = 1;
			}
			return prev + newPoints;
		}, 0);
		message = "You Solved the board in " + (guesses + 1) + " guesses!\nClick New Board to continue.";
	} else {
		restart();
	}
	
	function restart () {
		squares.forEach( function (elem, ind) {
			if (elem.class.indexOf('clicked') !== -1) {
				squares[ind].class = elem.class.split(' ').slice(0, 2).join(' ');
				squares[ind].imgClass = "ng-hide";
			} else if (elem.class.indexOf(' b') !== -1 || elem.class.indexOf(' a') !== -1) {
				squares[ind].class = elem.class.split(' ').slice(0, 3).join(' ');
				squares[ind].imgClass = "ng-hide";
			}
		});
		moves = [];
		message = "Keep trying!";
	}
	callback(moves, hints, squares, message, results, points);
}// end resetGuess

// ****************************************************************** //
// incrementMoves runs when a click even happens and there is more
// room on the moves list.  It
//	...adds a move to the moves list with
//		class: the chosen color
//		value: the associated number
//	...modifies the hits array so that
//		only the current hint has the class currentMove
//	...modifies the following properties of the active square
//		class: hasImage added, clicked added (only if its not first or last)
//		imgClass: ng-hide removed
//		image: hint for next move
// ****************************************************************** //
function incrementMoves (square, hints, moves, squares, callback) {
	var move = {};
	move.class = square.class.split(' highlight').join('');
	move.value = square.colorKey;

	hints = hints.map(function(elem) {
		var result = elem;
		result.class = elem.class.split(' currentMove').join('');
		return result;
	});
	hints[moves.length].class += ' currentMove';

	moves.push(move);
	if (square.class.indexOf(' b') === -1 && square.class.indexOf(' a') === -1) {
		square.class += ' clicked';
	}

	if (square.class.indexOf(' b') === -1) {
		square.class += ' hasImage';
		square.image = hints[moves.length - 1].image;
		square.imgClass = "";
	}
	callback(square, hints, moves, squares);
}// end incrementMoves()

// highlight adds the highlight class to a square if it is a possible move
function highlight (square, index, direction, guessNumber, clickedSquare,
		callback) {
	var toHighlight = [];
	var rowDiff = Math.abs(clickedSquare.value[0] - square.value[0])
	var columnDiff = Math.abs(clickedSquare.value[1] - square.value[1])
	square.class = square.class.split(' highlight').join('');
	if (square.class.indexOf(' hasImage') !== -1) {
		// don't highlight already clicked squares
	} else if (square.class.indexOf(' b') !== -1 && guessNumber < 5) {
		// don't highlight the end square until the end
	} else if(direction === "orthogonal") {
		if ((rowDiff === 1 && columnDiff === 0) || (rowDiff === 0 && columnDiff === 1)) {
			callback(index);
		}
	} else if(direction === "diagonal" && rowDiff === 1 && columnDiff === 1) {
		callback(index);
	} else if(direction === "long orthogonal") {
		if ((rowDiff === 0 && columnDiff === 3) || (rowDiff === 3 && columnDiff === 0)) {
			callback(index);
		}
	} else if(direction === "long diagonal" && rowDiff === 3 && columnDiff === 3) {
		callback(index);
	} else {
		callback('fuck');
	}
}

function makeHint (elem, ind) {
	if (ind === 5) {
		return {"class": 'square b', "imgClass": "ng-hide"};
	} else {
		var string = elem.direction.split(' ').reduce(function (prev, curr) {
			return prev + curr[0];
		}, '');
		var hint = {
				"class": 'square hasImage',
				"image": '../assets/img/' + string + '.png',
				"imgClass": ""
			};

		if (ind === 0) {
			hint.class += ' a';
		}

		return hint;
	}
}

module.exports = {
	stringState: stringState,
	deStringState: deStringState,
	resetGuess: resetGuess,
	incrementMoves: incrementMoves,
	highlight: highlight,
	makeHint: makeHint
}