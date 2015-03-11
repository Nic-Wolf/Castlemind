var completeBoard = require('../js/makeSquares.js').completeBoard;
var testInit = require('../js/makeSquares.js').testInit;

var squares;
testInit(function (result) {
	squares = result;
});
var size = 5;
var finalBoard;
completeBoard(squares, function (result) {
	finalBoard = result;
});

describe('completeBoard', function () {
	it('should produce a board with only one of each color in each row', function () {
		
		finalBoard.forEach(function (elem1) {
			finalBoard.forEach(function (elem2) {
				var samesquare = elem1.value === elem2.value;
				var same_color = elem1.colorKey === elem2.colorKey;
				var same_row = elem1.value[0] === elem2.value[0];
				expect(samesquare || !same_color || !same_row).toEqual(true);
			});
		});
	});
	it('should produce a board with only one of each color in each column', function () {
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
		console.log(finalBoard);
		expect(finalBoard.length).toEqual(size * size);
	});
});