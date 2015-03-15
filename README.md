#CastleMind

[Nic Wolf](https://github.com/Nic-Wolf)          - Prototyping & Front End
[David Hasenjaeger](https://github.com/GerryFudd) - Testing & Back End
[Aaron Ollis](https://github.com/aollis)       - Refactoring & Animation
& Special Thanks to:
[RJ Zaworski](https://github.com/rjz)

##Description
Castlemind is a simple game, designed to promote good problem-solving skills in children, from roughly 6 to 10 years of age.

An initial prototype for the game was designed by Chris Kelly, for youth enrichment courses he taught, and after some debate, decided that a virtual experience would be an excellent, and more easily distributed solution to mass-production of the physical product.

## Installation

Install gulp for building the client:

    $ npm install -g gulp

Then, install dependencies:

    $ npm install

Run tests:

    $ npm test

Build the client (will run watch task):

    $ gulp

And start the server at [http://localhost:3000](http://localhost:3000):

    $ npm start

---
###Development
The development lifecycle of this project wil consist of 4 stages, each taking approximately 2 weeks for completion

####Planning & Analysis
As a completed physical prototype of the game has already been established, our design and development choices will be heavily reliant on the previously-established model, and on further collaboration with Chris, as-needed.
Preliminary market research, prior to prototype design was already performed.

---
####Development - Stage 1
An initial working model of the game board will be established, along with minor interactivity, mainly including click functionality on each square.

The development will begin with testing of two options for game board creation:

1. (Ideal) HTML5 Canvas
2. (Fallback) HTML standard table elements

Additionally, as the board will remain as a static grid, there is little need for a responsive frontend, beyond basic scaling. For this reason we will be scaling down from desktop viewports to mobile viewports.

For simplicity while generating a working model, and for testing of the various options for board generation, the project structure will be additive.

Stage 1 Project Structure:
```
/
index.html
css/
  main.css
js/
  gameboard.js
```

---
####Development - Stage 2
After a working model has been built, our focus will be on user interactivity, and establishing a link between user action and application response. This will include visual changes on the board, populating user moves as a sequence, and storing data for the game board.

The initial effort will focus on constructing the board.When loaded, the board will generate a random assortment of 25 squares on a grid consisting of 4 colors, assign two elements randomly to the grid, and calculate a random path leading from the first element to the second.

The player's ultimate goal is to create a sequence of 5 moves which accurately match the sequence of moves the board has randomly generated. Our second focus will be on developing a HUD which displays hints of the random sequence, and the player's sequence.

Players are provided 3 points, which decrement on each unsuccessful guess of the random sequence. To maintain this score through multiple games, the players data will be stored locally in a cookie: no persistent user data will be stored, as a "high score" is fundamentally unneccessary for the game's premise.

---
####Development - Stage 3
After all necessary features have been developed, our focus will be on the user experience, and game's theme. This process will be a la carte, as we continue to consult with Chris regarding design choices and viewport layout.

During UI design, we will also focus on refactoring for deployment and scalability.

Stage 3 Project Structure:
```
./app.js                // main node server
./makeSquares.js        // logic for latin squares
./package.json
./bin/ 
--- www.bin             // Express binaries
./public/               // files sent to the frontend
--- javascripts/
------ eventHandlers.js // set up click events and UI changes
--- stylesheets/
------ style.css        // main styles for layout and game board
./routes/
--- index.js            // takes the data from makeSquares.js, puts in view layer
--- users.js            // currently unused.
./spec/                 // testing
--- board-spec.js
--- solver-spec.js
--- support/
------ jasmine.json
./views/                // Express templates
--- error.jade
--- index.jade
--- layout.jade

````

---
###Deployment & Maintenence
This process shall be relatively straightforward, involving website acquisition, hosting, and last-minute bugfixes.

At this point, the project will be complete, and our development work will be finished. Chris will then begin Kickstarter marketting and local advertising. Initial distribution will be regional, including batch-produced limited release of the physical version.

---
###License & Usage
This project is being developed under MIT license.
The original game concept and its design are &copy;2015 Chris Kelly.
