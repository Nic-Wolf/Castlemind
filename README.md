# [CastleMind](tba)
[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg)](https://github.com/Nic-Wolf/castlemind)
[![node](https://img.shields.io/node/v/gh-badges.svg)](https://github.com/Nic-Wolf/castlemind)
[![Travis](https://img.shields.io/travis/joyent/node.svg)](https://travis-ci.org/Nic-Wolf/castlemind.svg?branch=master)

[Nic Wolf](https://github.com/Nic-Wolf), [David Hasenjaeger](https://github.com/GerryFudd), [Aaron Ollis](https://github.com/aollis)

& Special Thanks to:

[RJ Zaworski](https://github.com/rjz)

### Contents
- [Description](#description)
- [Installation](#installation)
- [Project Structure](#project-structure)
- Development
    - [Stage 1](#stage-1)
    - [Stage 2](#stage-2)
    - [Stage 3](#stage-3)
    - [Deployment](#deployment-&-Maintenance)
- [Licence](#license-&-usage)

## Description
Castlemind is a simple puzzle game. Try to figure out the sequence of moves in as few guesses as possible!

The original concept was designed by [Cris Kelly](http://www.portlandcodeschool.com/meettheteam) to promote good problem-solving skills in children, from roughly 6 to 10 years of age... It's also pretty fun for us adults!

---

### Installation

##### Initial Setup
- [Download the latest release](https://github.com/Nic-Wolf/castlemind/archive/master.zip) or Clone the repo: `git clone https://github.com/Nic-Wolf/castlemind.git`.
- Download and Install [Node](https://nodejs.org/download).
- Install [Express](http://expressjs.com): `$ npm install express --save`.
- Install [Gulp](http://gulpjs.com): `$ npm install -g gulp`.
- Download project dependencies: `$ npm install`.

##### Compiling & Running
- Run tests: `$ npm test`.
- Compile the app: `$ gulp`.
- Start the application server: `$ npm start`.
- Navigate your browser to url: `localhost:3000`.

---

### Project Structure:
```
app.js                // Main Node Server
package.json
bin/ 
└── www.bin           // Express Binaries
public/               // Front-End App Files and Static Assets
├── components/
│   ├── angular/
│   │   ├── angular-cookies.js
│   │   ├── angular-route.js
│   │   └── angular.js
│   └── bootstrap/
│       └── bootstrap.min.css
├── img/
│   ├── castle-bg-md.jpg
│   ├── start.jpg
│   ├── end.jpg
│   ├── d.png
│   ├── o.png
│   ├── ld.png
│   └── lo.png
├── javascripts/
│   └── bundle.js        // compiled app
└── stylesheets/
        └── style.css        // main styles for layout and game board
. . .
```

## Development
The development lifecycle of this project wil consist of 4 stages, each taking approximately 2 weeks for completion

#### Planning & Analysis
As a completed physical prototype of the game has already been established, our design and development choices will be heavily reliant on the previously-established model, and on further collaboration with Chris, as-needed.
Preliminary market research, prior to prototype design was already performed.

### Stage 1
An initial working model of the game board will be established, along with minor interactivity, mainly including click functionality on each square.

The development will begin with testing of two options for game board creation:

1. (Ideal) HTML5 Canvas
2. (Fallback) HTML standard table elements

Additionally, as the board will remain as a static grid, there is little need for a responsive frontend, beyond basic scaling. For this reason we will be scaling down from desktop viewports to mobile viewports.

For simplicity while generating a working model, and for testing of the various options for board generation, the project structure will be additive.

#### Stage 2
After a working model has been built, our focus will be on user interactivity, and establishing a link between user action and application response. This will include visual changes on the board, populating user moves as a sequence, and storing data for the game board.

The initial effort will focus on constructing the board.When loaded, the board will generate a random assortment of 25 squares on a grid consisting of 4 colors, assign two elements randomly to the grid, and calculate a random path leading from the first element to the second.

The player's ultimate goal is to create a sequence of 5 moves which accurately match the sequence of moves the board has randomly generated. Our second focus will be on developing a HUD which displays hints of the random sequence, and the player's sequence.

Players are provided 3 points, which decrement on each unsuccessful guess of the random sequence. To maintain this score through multiple games, the players data will be stored locally in a cookie: no persistent user data will be stored, as a "high score" is fundamentally unneccessary for the game's premise.

#### Stage 3
After all necessary features have been developed, our focus will be on the user experience, and game's theme. This process will be a la carte, as we continue to consult with Chris regarding design choices and viewport layout.

During UI design, we will also focus on refactoring for deployment and scalability.

#### Deployment & Maintenence
This process shall be relatively straightforward, involving website acquisition, hosting, and last-minute bugfixes.

At this point, the project will be complete, and our development work will be finished. Chris will then begin Kickstarter marketting and local advertising. Initial distribution will be regional, including batch-produced limited release of the physical version.

---

### License & Usage
This project is being developed under MIT license.
The original game concept and its design are &copy;2015 Chris Kelly.
