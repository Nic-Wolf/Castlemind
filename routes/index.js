var express    = require('express');
var router     = express.Router();
var completeBoard = require('../makeSquares.js').completeBoard;
var makePath = require('../makePath.js').makePath;


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {title: 'Castlemind Main View'});
});

router.get('/api/game', function(req, res, next) {

	completeBoard(function(squares) {
		var path = makePath(squares);

		res.json({"board": squares, "path": path});
	});
});

module.exports = router;

