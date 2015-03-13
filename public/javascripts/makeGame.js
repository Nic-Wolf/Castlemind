window.onload = init;

function init() {
	// Page Variables //
	var divGrid = document.getElementById('divGrid');

	// Get data from express app //
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var data = JSON.parse(xhr.responseText);
		
		// we need the first and the last element in the array from makePath()
		console.log("1st Square Data:");
		console.log(data.board[0]);
		console.log("Path Data: ");
		console.log(data.path);
		//console.log("Starting Point: " + data.path[0].index + "\nDirection: " + data.path[0].direction);

		// Build the grid
		for (var i = 0; i < data.board.length; i++) {
			var square = newSquare(data.board[i]);
			divGrid.appendChild(square);
		}
		// for referencing the squares in the DOM
		var spnNodeList = document.getElementsByTagName("span");

		//Off-by-1 error fix

		// Set Starting and Ending Points
		spnNodeList[data.path[0].index].innerHTML = "A"; // find the div with the index of the starting point index
		spnNodeList[data.path[data.path.length-1].index].innerHTML = "B";

		// Setup a cheater that shows the path
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

	return square;
}//end newSquare()