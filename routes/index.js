var express    = require('express');
var router     = express.Router();
var completeBoard = require('../makeSquares.js').completeBoard;
var pathMaker = require('../makePath.js').pathMaker;


/* GET home page. */
router.get('/', function(req, res, next) {

	completeBoard(function(squares) {

		res.render('index', { 
			title: 'Castlemind Main View', 
			squares: squares
		});
	});

});

module.exports = router;

