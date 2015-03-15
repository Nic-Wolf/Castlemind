

function initBoard() {
	// Page Variables //
	var divGrid = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');
	// Set variable to reference the new squares in the DOM
	var spnNodeList = document.getElementsByTagName("span");

	// Get data from express app //
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var data = JSON.parse(xhr.responseText);

		// Build the grid
		for (var i = 0; i < data.board.length; i++) {
			var square = newSquare(data.board[i]);
			divGrid.appendChild(square);
		}

		// Set Starting and Ending Points
		spnNodeList[data.path[0].index].innerHTML = "A"; // find the div with the index of the starting point index
		spnNodeList[data.path[data.path.length-1].index].innerHTML = "B";

		// Setup a "cheater" that shows the path
		for (var i = 1; i < 5; i++) {
			spnNodeList[data.path[i].index].innerHTML += i;
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
	square.onclick = function() {
		if (divUserMoves.childElementCount < 5) {
			assignUserSquare(square);
			square.className += " clicked";
			square.clicked = true;
			destinationReached(square);
		} else {
			alert("You're out of moves!");
		}
	}//end onclick()

	return square;
}//end newSquare()


function destinationReached(square) {
	console.log(square.value);
	if (square.innerHTML === "B") {
		alert("you win!");
	}
}

function assignUserSquare(square) {
	var userChoice = document.createElement('span');
	userChoice.value = square.value;
	userChoice.className = square.className;
	divUserMoves.appendChild(userChoice);
}//end assignUserSquare()


function clicked(square) {
	square.className += " clicked";
	square.clicked = true;
	divUserMoves.appendChild(square);

}//end clicked()


function resetBoard(parentElement) {
	// Destroy the board if it's been assembled before
	// Using "while" here to force sync.
	while (parentElement.childElementCount != 0) {
		for (var i = 0; i < parentElement.childElementCount; i++) {
			parentElement.removeChild(parentElement.children[i]);
		}
	}
}//end reset()


module.exports = {
  initBoard: initBoard,
  resetBoard: resetBoard
};












