//************************************************************//
// Title:    Game Board - Initializer and Checker
// Project:  CastleMind
// Author:   Nic Wolf
// Sources:  None
// Revision: 0.0.3 (3/1/2015)
//************************************************************//
/* Description:
	 Sets up the game board, generating randomly-colored squares
	 and assigns each a unique coodinate and color.

	 TODOS:
		 - Maybe to a custom html tag instead of all that div crap
		 - 
*/


window.onload = init;

function init() {

	var squares = document.getElementsByClassName('square');

	squares.onclick = function() {
		alert("You clicked here.");
	}

}//end init()

