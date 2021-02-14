# swamphacks-2021

A game in development for fun.

## Setup

Run the command `npm run init`. YOU MUST INCLUDE THE `run` BEFORE THE INIT

## Running

Use the command `npm start` to launch the server and then navigate to the supplied address

Press `Ctrl+C` to stop the server

# Contributing

Before commiting, please use `npm test` to check your code using standard.js

# Dependencies 

This project uses:
- **pixi.js**: Graphics library
- **socket.io**: Multiplayer functionality
- **sqlite3**: Not yet implemented. Will be used for a scoreboard / account system
- **standard**: Code style
- **nodemon**: Development dependency, monitors server source and restarts if edited
- **serve**: Development dependency to serve game files

Dependencies planned to be added in the future:
- **webpack**

---

# To Do List
## Client
### Player
- [ ] adjust angle of player to point more accurately at the cursor.
- [x] Load all texture assets in `init()`
- [x] Layer foot and body texture assets on top of one another.
- [ ] Adjust assets based on action. Sidestepping, sprinting vs idle assets.
### Map
- [ ] Create `map.js`
- [ ] Invent how to store map data and load it
### index.js
- [ ] Clean up index
## Server
- Currently not in development
