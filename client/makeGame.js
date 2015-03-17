var solution;
var squareCount = 0;

function initBoard() {
	// Page Variables //
	var divGrid      = document.getElementById('divGrid');
	var divHints     = document.getElementById('divHints');
	var divUserMoves = document.getElementById('divUserMoves');
	var spnNodeList  = document.getElementsByTagName("span");

	// Get data from express app //
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var i;
		var data = JSON.parse(xhr.responseText);

		// Set the solution for the game
		solution = data.path;

		// Build the grid
		for (i = 0; i < data.board.length; i++) {
			var square = newSquare(data.board[i]);
			divGrid.appendChild(square);
		}

		// Set Starting Point
		spnNodeList[data.path[0].index].innerHTML = "A";
		spnNodeList[data.path[0].index].className += " a";
		spnNodeList[data.path[0].index].onclick = ""; // Remove click functionality

		// Set Ending Point
		spnNodeList[data.path[data.path.length-1].index].innerHTML = "B";
		spnNodeList[data.path[data.path.length-1].index].className += " b";

		// Populate the hints
		var hintColor;
		var hintText;

		for (var i = 0; i < 5; i++) {
			hintColor = data.board[data.path[i].index].colorKey;
			hintText = data.path[i].direction.split(' ').reduce(function (prev, curr) {
				return prev + curr[0];
			}, '');
		
			assignHintSquare(hintColor,hintText);
		}

	};
	xhr.open('get', '/api/game');
	xhr.send();

}//end initBoard()


// Create new Squares
function newSquare(squareData) {
	var square = document.createElement('span');
	square.value = squareData.value;
	square.className = 'square color-' + squareData.colorKey;
	square.clicked = false;
	square.hasIndex = squareCount;
	squareCount++;

	square.onclick = function() {
		assignUserSquare(square);
		console.log(square.hasIndex);
		// Don't dull the final square.. it's kinda redundant.
		if (square.innerHTML != "B") {
			square.className += " clicked";
			square.clicked = true;
		}
		console.log(divUserMoves);
		console.log(solution[4].index);
		checkMove();
	};//end onclick()

	return square;
}//end newSquare()


function checkMove() {
	if (divUserMoves.childElementCount === 5) {
		var n;
		var moves = [];
		// Push hints to the move list
		for (n = 0; n < 5; n++) {
			moves.push(divUserMoves.children[n]);
		}

		n = 0;
		while (Number(moves[n].className.slice(-1)) === solution[n].solution) {
			divHints.children[n].className = moves[n].className;
			n++;
		}

		// if the grid index of the 5th clicked square === the index value of the last item in the solution array
		if (divUserMoves.children[4].hasIndex === solution[solution.length-1].index) {
			alert('You win!');
		} else {
			alert('Try again!');
			unClick();
			resetBoard(divUserMoves);
		}
	}
}//end checkMove()


function assignUserSquare(square) {
	var userChoice = document.createElement('span');
	userChoice.value = square.value;
	userChoice.className = square.className;
	userChoice.hasIndex = square.hasIndex;
	divUserMoves.appendChild(userChoice);
}//end assignUserSquare()


function assignHintSquare(colorKey, direction) {
	var hint = document.createElement('span');
	hint.innerHTML = direction;
	hint.className = 'square';
	divHints.appendChild(hint);
}//end assignUserSquare()


function unClick() {
	var name;

	for (var n = 0; n < divGrid.childElementCount; n++) {
		name = divGrid.children[n].className.split(' ').slice(0, 2).join(' ');
		
		if (divGrid.children[n].innerHTML !== "A" && divGrid.children[n].innerHTML !== "B") {
			divGrid.children[n].clicked = false;
			divGrid.children[n].className = name;
		}
	}
}//end unClick()


function resetBoard(parentElement) {
	// Destroy the board if it's been assembled before
	// Using "while" here to force sync.
	while (parentElement.childElementCount !== 0) {
		for (var i = 0; i < parentElement.childElementCount; i++) {
			parentElement.removeChild(parentElement.children[i]);
		}
	}
}//end reset()


module.exports = {
  initBoard: initBoard,
  resetBoard: resetBoard
};

