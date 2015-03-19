

Highlight Function
     options:
-faded out square
-darkened border
-semi-transparent image?
-Should we use jquery?

-we can also add a highlight feature that shows you your potential moves, rather than conveying that a square has already been selected.

-How should we handle removing a highlight, when would this be necessary?
	-When game is reset
	-after game has shown potential selections and the player has made a choice

code:

http://ngmodules.org/modules/angular-highlightjs
http://codeforgeek.com/2014/12/highlight-search-result-angular-filter/


Overall Layout Design Ideas: 

	Hints

	--Hints could have animations(buzz), number of hints being displayed decreases as each move is made(fade away).
	-Hints can be displayed above board, previous moves below.
	

	Previous Moves
-When a color square is added to previous moves, a quick animation will take place that affects both the added square and the previous moves container itself. 


When user launches app:

-Could first display castle mind title page with an image, then slide away to reveal generated game- board. Once you create new game, hints and movement bars will load/fade-in, there could be a sound to announce the start of the game.

