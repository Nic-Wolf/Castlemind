var express    = require('express');
var router     = express.Router();
var squareGrid = require('../makeSquares.js');


/* GET home page. */
router.get('/', function(req, res, next) {

	squareGrid.completeBoard(function(squares) {

		res.render('index', { 
			title: 'Castlemind Main View', 
			squares: squares,
		});
	});

});

module.exports = router;

