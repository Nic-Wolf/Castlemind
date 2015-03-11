window.onload = init;

	function init() {

	var divGrid = document.getElementById('divGrid');

	
	// ******************************************* //
	// ZEROTH RUN - BUILD THE GRID //
	// ******************************************* //
		for (var row = 1; row < 6; row++) {
			for (var col = 1; col < 6; col++) {
				var square = newSquare(row, col);
				divGrid.appendChild(square);
			}
		}
		// Get the elements and assign to an array
		// FYI - since we're creating divs, we need to accomodate for the right index.
		var divNodeList = document.getElementsByTagName("div");


	// ******************************************* //
	// FIRST RUN - SET UP THE FIRST COLUMN //
	// ******************************************* //
		// Create an array to hold "unused" colors
		var col1Colors = [0, 1, 2, 3, 4];
		// Colorize the first column
		for (var i = 1; i < 26; i += 5) {
			newColor(divNodeList[i], col1Colors);
		}


	// ******************************************* //
	// SECOND RUN - SET UP THE FIRST ROW //
	// ******************************************* //
		// Set the unused colors for the row
		var row1Colors = [0, 1, 2, 3, 4];
		// Remove the color that was used from the first run
		row1Colors.splice(row1Colors.indexOf(divNodeList[1].color), 1);
		console.log("Color at 0, 0: " + divNodeList[1].color + "\nrow colors: " + row1Colors);
		// Traverse the grid and colorize the first row
		for (var i = 2; i < 6; i++) {
			newColor(divNodeList[i], row1Colors);
		}


	// ******************************************* //
	// THIRD RUN - COLORIZE THE GRID //
	// ******************************************* //
		// Setup more subtractive arrays for colors
		var colColors = [0, 1, 2, 3, 4];

		for (var row = 2; row < 6; row++) {
			// Remove the color at this point that was used from the 2nd run
			colColors.splice(colColors.indexOf(divNodeList[row].color), 1);

			
			for (var col = 2; col < 6; col ++) {
				//get the right position in the node list.
				newColor(divNodeList[row*col], colColors);
			}
		}






	




// Setup a "factory" function to create new squares
function newSquare(x, y) {
	// TODO - maybe your own damn html element. this shit'll get confusing later.
	var square = document.createElement('div');   // create a new HTMLDivElement
	square.value = [x, y];                        // assign the grid coordinates to the element's value as an array
	square.className = 'square';                  //assign the .square style class
	//square.style.backgroundColor = randomColor(); // generate a random color

	// TESTS
	// display the x/y in the square
	square.innerHTML = x + ", " + y; 

	return square;
}//end newSquare()
	

	//var square = {};

	// This takes a random value from an array, 
	// injects it into an object, and deletes it from the array.
	// take note that this only checks from a color pool for rows.
	function newColor(square, row) {
		console.log("\n---- Begin newColor() ----");
		console.log("Passed row: " + row);
		// Get a randomly-selected value from the array
		var randomVal = row[ Math.floor( Math.random() * row.length)];
		console.log("randomVal is: " + randomVal);
		// Assign to the square
		square.color = randomVal;
		// remove that value from the array
		row.splice(row.indexOf(randomVal), 1);
		console.log("Returned row: " + row + "\n---- End newColor() ----");


		// we need to remove the item, regardless of where it is in the array


		//we need to assign the value at the index
		colorFix(square);

	}//end newColor()


	//get real colors, not just numbers
	function colorFix(square) {
		switch (square.color) {
			case 0:
				// checkColor(x, y);
				square.style.backgroundColor = "#ff0000";
				break;
			case 1:
				// checkColor(x, y);
				square.style.backgroundColor = "#ffff00";
				break;
			case 2:
				// checkColor(x, y);
				square.style.backgroundColor = "#00ff00";
				break;
			case 3:
				// checkColor(x, y);
				square.style.backgroundColor = "#ff00ff";
				break;
			case 4:
				// checkColor(x, y);
				square.style.backgroundColor = "#0000ff";
				break;
			default:
				console.log("Switch error!");
		}
	}//end colorFix()



	// if item at 0, 6, 11, 16 21







}//end init()