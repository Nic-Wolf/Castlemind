var completeBoard = require('../js/makeSquares.js').completeBoard;
var refineBoard = require('../js/makeSquares.js').refineBoard;
var guesser = require('../js/makeSquares.js').guesser;
var initSquares = require('../js/makeSquares.js').initSquares;


var squares;
initSquares(function (result) {
	squares = result;
});

describe('makeSquares', function () {
	it('should have a function called initSquares that makes the top row and first column', function() {
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
	it('should have a function called refineBoard that produces a board with only one of each color in each row', function () {
		var newSquares = refineBoard(squares);
		newSquares.forEach(function (elem1) {
			newSquares.forEach(function (elem2) {
				var samesquare = elem1.value === elem2.value;
				var same_color = elem1.colorKey === elem2.colorKey;
				var same_row = elem1.value[0] === elem2.value[0];
				expect(samesquare || !same_color || !same_row).toEqual(true);
			});
		});
	});
	it('should have a function called refineBoard that produces a board with only one of each color in each column', function () {
		var newSquares = refineBoard(squares);
		newSquares.forEach(function (elem1) {
			newSquares.forEach(function (elem2) {
				var samesquare = elem1.value === elem2.value;
				var same_color = elem1.colorKey === elem2.colorKey;
				var same_column = elem1.value[1] === elem2.value[1];
				expect(samesquare || !same_color || !same_column).toEqual(true);
			});
		});
	});
	it('should have a function called refineBoard that produces a more complete board', function () {
		var newSquares = refineBoard(squares);
		expect(newSquares.length).toBeGreaterThan(squares.length);
	});

	it('should have a function called guesser stores the old board, the list of guesses, and applies the new guess', function () {
		guesser(squares, 0, function () {
			expect(arguments[0].length).toEqual(10);
			expect(Object.keys(arguments[1]).length).toEqual(1);
			expect(arguments[2][0]).toEqual(squares);
		});
	});
	
	it('should have a function called completeBoard that produces a board with only one of each color in each row', function () {
		var finalBoard = completeBoard(squares);
		finalBoard.forEach(function (elem1) {
			finalBoard.forEach(function (elem2) {
				var samesquare = elem1.value === elem2.value;
				var same_color = elem1.colorKey === elem2.colorKey;
				var same_row = elem1.value[0] === elem2.value[0];
				expect(samesquare || !same_color || !same_row).toEqual(true);
			});
		});
	});
	it('should have a function called completeBoard that produces a board with only one of each color in each column', function () {
		var finalBoard = completeBoard(squares);
		finalBoard.forEach(function (elem1) {
			finalBoard.forEach(function (elem2) {
				var samesquare = elem1.value === elem2.value;
				var same_color = elem1.colorKey === elem2.colorKey;
				var same_column = elem1.value[1] === elem2.value[1];
				expect(samesquare || !same_color || !same_column).toEqual(true);
			});
		});
	});
	it('should have a function called completeBoard that produces a complete board', function () {
		var finalBoard = completeBoard(squares);
		expect(finalBoard.length).toEqual(25);
	});
});