

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

Animation Ideas:

Animations should be handled in Angular, mainly using ng-repeat, although there are several other angular directives that are built well for handling animations. 

Animations should be subtle yet fun and should add to the overall user experience.

--------------------------------------------------------------------------------------------------------

Notes 3/23 DESIGN IDEAS

Animation Ideas: 

User Guesses and Path Hints:

-When squares exit - Have a 'falling off' animation that shows the squares falling from the container.
	-When squares are inserted back in, have a subtle/temporary glow effect signifying that the new squares have been inserted.

Message (top of screen)

	-Could have borders around this message/ something to distinguish it from what's surrounding. Right now it looks pretty plain just spawning as simple text. Could add colors to text.

	-One idea would be to have a border around the message that is highly decorated/fantasy themed, possibly with a wizard on the left and a dragon on the right of the container, so that each time it spawns it fits in more and adds a nice visual element to the game.
		-Will try to draw this in class tomorrow on paper

	-Animations: Size increase animation once triggered, comes to forefront of screen. Buzz effect could be fun.

Background:

	-Eventually add in different backgrounds, could either switch at random or based on user preference. 
		-Unlockable backgrounds based on goals/number of points earned

Game Board:

	-Once solved/new board is set, have a 'falling away' effect showing all the squares tumbling down as new ones are set.

	OR

	-when new gameboard is created, have all of the squares come together by flying in from different sides of the screen, where they all enter and lock into a grid, and then once this happens there is a temporary glow effect to show that the board has been created.
	Could look pretty badass.


Highlighted Squares:

	-Should borders around highlighted/pulsing squares be slightly thinner? Have been debating this, was wondering what other opinions were.

Buttons(Reset, How do I game, New game, Cancel guess):

	-Right now these are plain buttons, I could see more rounded buttons working, as well as many other styles, especially ones that fit in with fantasy theme. Will look around for styles online.

	Animation - When clicked, subtle animation to display. Could be a slight color change, glow, etc...


































