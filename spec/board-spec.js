var refineBoard = require('../js/makeSquares.js').refineBoard;
var guesser = require('../js/makeSquares.js').guesser;
var initSquares = require('../js/makeSquares.js').initSquares;
var setPossibles = require('../js/makeSquares.js').setPossibles;

var squares;
initSquares(function (result) {
	squares = result;
});

describe('initSquares', function () {
	it('should make the top row and first column', function() {
		initSquares(function (result) {
			expect(result[0]).toEqual({
				value: [0, 0],
				colorKey: 0
			});
			result.forEach(function(elem) {
				if (elem.value[1] === 0) {
					expect(elem.value[0]).toEqual(elem.colorKey);
				} else {
					expect(elem.value[0]).toEqual(0);
					expect(elem.value[1]).toEqual(elem.colorKey);
				}
			});
		});
	});
});
describe('refineBoard', function () {
	it('should produce a board with only one of each color in each row', function () {
		refineBoard(squares, 0, function (result) {
			result.forEach(function (elem1) {
				result.forEach(function (elem2) {
					var samesquare = elem1.value === elem2.value;
					var same_color = elem1.colorKey === elem2.colorKey;
					var same_row = elem1.value[0] === elem2.value[0];
					expect(samesquare || !same_color || !same_row).toEqual(true);
				});
			});
		});
	});
	it('should produce a board with only one of each color in each column', function () {
		refineBoard(squares, 0, function (result) {
			result.forEach(function (elem1) {
				result.forEach(function (elem2) {
					var samesquare = elem1.value === elem2.value;
					var same_color = elem1.colorKey === elem2.colorKey;
					var same_column = elem1.value[1] === elem2.value[1];
					expect(samesquare || !same_color || !same_column).toEqual(true);
				});
			});
		});
	});
	it('should produce a more complete board', function () {
		refineBoard(squares, 0, function (result) {
			expect(result.length).toBeGreaterThan(squares.length);
		});
	});
});
describe('guesser', function () {
	it('should store the old board, the list of guesses, and applies the new guess', function () {
		guesser(squares, 0, function () {
			expect(arguments[0].length).toEqual(squares.length + 1);
			expect(Object.keys(arguments[1]).length).toBeGreaterThan(0);
			expect(arguments[2][0][1][0]).toEqual(squares);
			// console.log(arguments[1]);
			// console.log(arguments[2]);
		});
	});
});