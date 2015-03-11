var 

// generate a random integer from {0,...,n - 1}
function randInt (n) {
	return Math.floor(Math.random() * n);
}

// generate a pair of distinct integers from {0,...,n - 1}
function pickTwo (n) {
	var first = randInt(n);
	var second = randInt(n - 1);
	if (second < first) {
		return {'a': first, 'b': second};
	} else {
		return {'a': first, 'b': second + 1};
	}
}

function makePath (squares) {
	var result = [];
	result[0] = pickTwo(25);

	return result;
}

module.exports.makePath = makePath;