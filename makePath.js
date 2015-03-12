// generate a random integer from {0,...,n - 1}
function randInt (n) {
	return Math.floor(Math.random() * n);
}

// generate a pair of distinct integers from {0,...,n - 1}
function pickTwo (size) {
	var first = randInt(n);
	var second = randInt(n - 1);
	if (second < first) {
		return {'a': first, 'b': second};
	} else {
		return {'a': first, 'b': second + 1};
	}
}

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
}



function makePath (squares) {
	var size = squares.length;
	var result = [];
	result[0] = pickTwo(size);

	return result;
}

module.exports.makePath = makePath;