'use strict'

import gameStates from './gameStates/gameStates.js'

// import config from './config.js'

// let player_id = undefined

// Object to contain all the sprites
let currentState
let app

// Initialize socket connection and receive our id and start the game
// const socket = io(config.server_address)
// socket.on('init', data => {
//   player_id = data
//   console.log('connected as ' + player_id)
// })

// PIXI init
initPIXI()

// Pre Init
gameStates.play.preInit()

// Start game when done loading
PIXI.Loader.shared.onComplete.add(startUpdates)
PIXI.Loader.shared.load()

// All the code to set up the PIXI canvas
function initPIXI () {
  // Determine if the web browser supports WebGL
  let type = 'WebGL'
  if (!PIXI.utils.isWebGLSupported()) {
    type = 'Canvas'
  }
  PIXI.utils.sayHello(type)

  // Set up the PIXI app and add it to the html document as a Canvas
  app = new PIXI.Application({ width: 1280, height: 720, antialias: true })
  document.body.appendChild(app.view)
}

// Changes game state from the menu to the play state
function startGameHandler () {
  gameStates.play.init(app)
  currentState.remove()
  currentState = gameStates.play
}

function startUpdates () {
  gameStates.start.init(app, startGameHandler)
  currentState = gameStates.start

  // Set State and Start Ticker
  app.ticker.add(delta => gameLoop(delta))

  // Game Loop
  function gameLoop (delta) {
    currentState.loop()
  }
}

// function destroy () {
//   gameStates.start.destroy()
//   gameStates.play.destroy()
// }
