var express       = require('express');
var router        = express.Router();
var completeBoard = require('../models/makeSquares.js').completeBoard;
var makePath      = require('../models/makePath.js').makePath;


// GET Homepage //
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET mainpage //
router.get('/main', function(req, res, next) {
	res.render('main');
});

// GET game page //
router.get('/game', function(req, res, next) {
	res.render('game', {title: 'Castlemind Game View'});
});

// GET tutorial page //
router.get('/tutorial', function(req, res, next) {
	res.render('tutorial', {title: 'Castlemind Tutorial'});
});

// GET Game API //
router.get('/api/game', function(req, res, next) {

	completeBoard(function(squares) {
		var path = makePath(squares);

		console.log(squares);
		console.log(path);
		res.json({"board": squares, "path": path});
	}, 5);
});

module.exports = router;

