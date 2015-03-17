var solution;

function initBoard() {
	// Page Variables //
	var divGrid = document.getElementById('divGrid');
	var divHints = document.getElementById('divHints');
	var divUserMoves = document.getElementById('divUserMoves');
	// Set variable to reference the new squares in the DOM
	var spnNodeList = document.getElementsByTagName("span");

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
	square.onclick = function() {
		assignUserSquare(square);
		square.className += " clicked";
		square.clicked = true;
		// destinationReached(square);
		if (divUserMoves.childElementCount === 5) {
			console.log(typeof(divUserMoves.children));
			var n;
			var moves = [];
			for (n = 0; n < 5; n++) {
				moves.push(divUserMoves.children[n]);
			}
			if(!moves.some(function (elem, index) {
				console.log(elem.className + ' vs ' + solution[index].solution);
				console.log(Number(elem.className.slice(-1)) + ' vs ' + solution[index].solution);
				return Number(elem.className.slice(-1)) !== solution[index].solution;
			})) {
				alert('You win!');
			} else {
				alert('Try gain!');
			}
			
			n = 0;
			while (Number(moves[n].className.slice(-1)) === solution[n].solution) {
				divHints.children[n].className = moves[n].className;
				n++;
			}
			unClick();
			resetBoard(divUserMoves);
		}
	};//end onclick()

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

function assignHintSquare(colorKey, direction) {
	var hint = document.createElement('span');
	hint.innerHTML = direction;
	hint.className = 'square';
	divHints.appendChild(hint);
}//end assignUserSquare()


function clicked(square) {
	square.className += " clicked";
	square.clicked = true;
	divUserMoves.appendChild(square);
}//end clicked()

function unClick () {
	var name;
	for (var n = 0; n < divGrid.childElementCount; n++) {
		name = divGrid.children[n].className.split(' ').slice(0, 2).join(' ');
		
		if (divGrid.children[n].innerHTML !== "A" && divGrid.children[n].innerHTML !== "B") {
			divGrid.children[n].clicked = false;
			divGrid.children[n].className = name;
		}
	}
}


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












