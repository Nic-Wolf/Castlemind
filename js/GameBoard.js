//************************************************************//
// Title:    Game Board - Main Class
// Project:  CastleMind
// Author:   Nic Wolf
// Sources:  None
// Revision: 0.0.2 (3/1/2015)
//************************************************************//
/* Description:
   Sets up the game board, generating randomly-colored squares
   and assigns each a unique coodinate and color.

   TODOS:
     - colors need validating. can't have congruent colors
     - 
*/

window.onload = init;

function init() {

	var divGrid = document.getElementById('divGrid');

	for (var row = 1; row < 6; row++) { // Setup the squares as a grid in the DOM
		for (var col = 1; col < 6; col++) {
			divGrid.appendChild(newSquare(row, col));
		}
	}

	// Get an array of the squares as their HTMLElements
	// TODO - create a custom element to use instead of something so ubiquitous.
	var divNodeList = document.getElementsByTagName("div");
	//var rgb = divNodeList[1].style.backgroundColor; //don't forget that the 0th div is the parent.

	// TESTING
	// log every square's hex color.
	for (var i = 1; i < divNodeList.length; i++) {
		//console.log("Color: " + getHex(divNodeList[i].style.backgroundColor) + ", Coordinates: " + divNodeList[i].value);
		
		// Check to see if there are congruent colors
		// Just validate the rows for now
		// console.log(divNodeList[i].style.backgroundColor);
		var check = 0;
		while (divNodeList[i].style.backgroundColor === divNodeList[i-1].style.backgroundColor) {
			check++;
			console.log("checked square " + i + " " + check + " times.");
			divNodeList[i].style.backgroundColor = randomColor();
		}



		//console.log("checked the row");
	}
}//end init()


// Setup a "factory" function to create new squares
function newSquare(x, y) {
	// TODO - maybe your own damn html element. this shit'll get confusing later.
	var square = document.createElement('div');   // create a new HTMLDivElement
	square.value = [x, y];                        // assign the grid coordinates to the element's value as an array
	square.className = 'square';                  //assign the .square style class
	square.style.backgroundColor = randomColor(); // generate a random color

	// TESTS
	// display the x/y in the square
	square.innerHTML = x + ", " + y; 

	return square;
}//end newSquare()


//******* WIP *********
// Make a new DOM element that allows us to create an object and extends a div
function newerSquare(rowNum, colNum) {
	var x = rowNum;
	var y = colNum;

	var gameSquare = document.registerElement('gamesquare', {
		prototype: Object.create(HTMLDivElement.prototype),
		extends: 'div'
	});

	gameSquare.className = 'square';

	gameSquare.style.backgroundColor = randomColor(x, y);
	
	gameSquare.innerHTML = x + ", " + y; 

	return gameSquare;

}//end newerSquare()


// Generate a random color as a string to be passed into *.style.backgroundColor attribute
function randomColor() {
	var randomValue = Math.floor(Math.random() * 5);
	switch (randomValue) {
		case 0:
			// checkColor(x, y);
			return "#ff0000";
			break;
		case 1:
			// checkColor(x, y);
			return "#ffff00";
			break;
		case 2:
			// checkColor(x, y);
			return "#00ff00";
			break;
		case 3:
			// checkColor(x, y);
			return "#ff00ff";
			break;
		case 4:
			// checkColor(x, y);
			return "#0000ff";
			break;
		default:
			console.log("Switch error!");
	}
}//end randomColor()


// Take the value of HTMLElement.style.backgroundColor
// Retrieve an array of RGB values
function getHex(rgbString) {
	// Clip the ends
	rgbString = rgbString.slice(4, 16); // Remove "rgb("
	rgbString = rgbString.slice(0, rgbString.length - 1) // remove ")"

	var colorArray = [];

	// Loop through to get the 3 color values
	for (var h = 0; h < 3; h++) {
		// Assign the color
		var color = rgbString.slice(0, 4);
		color = color.match(/\d{1,3}/i);
		color = color.toString();
		colorArray[h] = color;

		// Clip from the string
		var clip = 0; // Value sets the cursor
		for (var i = 0; i < rgbString.length; i++) {
			if (rgbString.charAt(i) === color.charAt(i)) {
				clip++;
			}
		}
		// Update the rgb string
		rgbString = rgbString.slice(clip + 2, rgbString.length);
	}
	
	return parseRGBtoHex(colorArray);


	//******************************
	// INTERNAL FUNCTIONS
	function parseRGBtoHex(rgbArray) {
		var hex = "#";

		for (var i = 0; i < rgbArray.length; i++) {
			hex += ("0" + parseInt(rgbArray[i]).toString(16)).slice(-2);
		}
		return hex;
	}//end parseRGBtoHEX()

}//end getColors()














