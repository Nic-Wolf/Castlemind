var express    = require('express');
var router     = express.Router();
var completeBoard = require('../makeSquares.js').completeBoard;
var makePath = require('../makePath.js').makePath;


/* GET home page. */
router.get('/', function(req, res, next) {

	completeBoard(function(squares) {

		var path = makePath(squares);
		res.render('index', { 
			title: 'Castlemind Main View', 
			squares: squares,
			path: path
		});
	});

});

module.exports = router;

