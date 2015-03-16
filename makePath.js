// generate a random integer from {0,...,n - 1}
function randInt (n) {
	return Math.floor(Math.random() * n);
}

// remove the elements of B from A
function difference (A, B) {
	var result = [];
	A.forEach(function (elem) {
		if (B.indexOf(elem) === -1) {
			result.push(elem);
		}
	});
	return result;
}
// ******************************************** //
// getAdjacent generates an array containing
// the indexes of every square adjacent to 
// the input coordinates
// ******************************************** //
function getAdjacent (coordinates, size) {
	var length = Math.sqrt(size);
	var rows = [];
	var col;
	function makeRow (num) {
		var row = [];
		for (col = 0; col < length; col++) {
			row.push(col + num * length);
		}
		rows.push(row);
		if (num < length - 1) {
			makeRow(num + 1);
		}
	}

	makeRow(0);
	
	var adjacents = [];
	rows.forEach(function (row, rowNumber) {
		var relHeight = rowNumber - coordinates[0];
		if (relHeight < 0) {
			relHeight = -relHeight;
		}
		if (relHeight <= 1) {
			row.forEach(function (number, colNumber) {
				var horDist = colNumber - coordinates[1];
				if (horDist < 0) {
					horDist = -horDist;
				}
				if (horDist === 1 || (horDist === 0 && relHeight !== 0)) {
					adjacents.push(number);
				}
			});
		}
	});

	return adjacents;
} // End getAdjacent

function makePath (squares) {
	var size = squares.length;
	var length = Math.sqrt(size);
	var result = [];
	var path = [];
	path.push({"index": randInt(size)});
	var pathNumbers = [];
	pathNumbers.push(path[0].index);
	var current = squares[path[0].index];
	var possible;
	var n;
	for (n = 1; n <= length; n++) {
		possible = difference(getAdjacent(current.value, size), pathNumbers);
		if (possible.length > 0) {
			path.push({"index": possible[randInt(possible.length)]});
			pathNumbers.push(path[n].index);
			previous = current;
			current = squares[path[n].index];
			if (previous.value[0] === current.value[0] || previous.value[1] === current.value[1]) {
				path[n - 1].direction = 'orthogonal';
			} else {
				path[n - 1].direction = 'diagonal';
			}
			path[n - 1].solution = current.colorKey;
		}
	}
	return path;
}

module.exports.makePath = makePath;