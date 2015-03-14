function init() {
	// Page Variables //
	var divGrid = document.getElementById('divGrid');
	var divUserMoves = document.getElementById('divUserMoves');

	// Get data from express app //
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var data = JSON.parse(xhr.responseText);

		// Build the grid
		for (var i = 0; i < data.board.length; i++) {
			var square = newSquare(data.board[i]);
			divGrid.appendChild(square);
		}

		// Set variable to reference the new squares in the DOM
		var spnNodeList = document.getElementsByTagName("span");

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

}//end init()


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
		} else {
		alert("You're out of moves!");
	}
		
	}

	return square;
}//end newSquare()

function assignUserSquare(square) {
	// if (divUserMoves.childElementCount < 5) {
		var userChoice = document.createElement('span');
		userChoice.value = square.value;
		userChoice.className = square.className;
		divUserMoves.appendChild(userChoice);
	// } else {
	// 	alert("You're out of moves!");
	// }
}//end assignUserSquare()


var clickCount = 5;

function newRound(spnNodeList) {
	var count = 0;

	for (var i = 0; i < spnNodeList.length; i++) {

		if (spnNodeList[i].clicked === true) {
			count++
			if (count >= 5) {
				alert("You're out of moves!");
			}
		}
	}
}//end newRound()

function clicked(square) {
	square.className += " clicked";
	square.clicked = true;
	divUserMoves.appendChild(square);

}//end clicked()

// Setup an onclick for the squares. this will need:
  // to assign a style class that "greys out" the square once it is clicked.
  // to assign a style to the adjacent squares which show the user that they can be clicked
  // to assign onclick to the adjacent squares



module.exports = {
  init: init
};












