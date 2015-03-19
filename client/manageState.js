
// stringState converts the board data to a pair of strings
function stringState (data, callback) {
	var squares = data.board.reduce( function (prev, curr) {
		return prev + curr.colorKey;
	}, '');
	var solution = data.path.reduce( function (prev, curr, ind) {
		if (ind < data.path.length - 1) {
			return prev + curr.index + curr.direction + curr.solution + '#';
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
	var solutionArray = solutionString.split('#');
	solutionArray.forEach( function (elem, ind) {
		console.log(elem);
		if (ind < solutionArray.length - 1) {
			var newMove = {};
			newMove.direction = elem.match(/[^\d]+/)[0];
			newMove.index = Number(elem.slice(0,elem.match(/[^\d]+/).index));
			newMove.solution = Number(elem.slice(-1));
		} else {
			var newMove = {};
			newMove.index = Number(elem);
		}
		console.log(newMove);
		solution.push(newMove);
	});
	if (moveString.length > 0) {
		var moves = moveString.split('#');
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
function resetGuess (moves, hints, squares, solution, callback) {
	squares.forEach( function (elem, ind) {
		if (elem.class.indexOf('clicked') !== -1) {
			squares[ind].class = elem.class.split(' ').slice(0, 2).join(' ');
			squares[ind].imgClass = "ng-hide";
		} else if (elem.class.indexOf(' b') !== -1) {
			squares[ind].class = elem.class.split(' ').slice(0, 3).join(' ');
			squares[ind].imgClass = "ng-hide";
		}
	});
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
	})) {
		message = "You win!";
	} else {
		moves = moves.slice(0, 1);
		message = "Keep trying!";
	}
	callback(moves, hints, squares, message);
}// end resetGuess

module.exports = {
	stringState: stringState,
	deStringState: deStringState,
	resetGuess: resetGuess
}