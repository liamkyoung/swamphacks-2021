import gameStates from './gameStates/gameStates.js'

import config from './config.js'

let player_id = undefined

// Object to contain all the sprites
let currentState = undefined
let app = undefined

// Initialize socket connection and receive our id and start the game
const socket = io(config.server_address)
socket.on('init', data => {
  player_id = data
  console.log('connected as ' + player_id)
  start()
})

// starts the game
function start () {
  initPIXI()
  loop()
  //destroy()
}

// All the code to set up the PIXI canvas
function initPIXI () {
  // Determine if the web browser supports WebGL
  let type = 'WebGL'
  if (!PIXI.utils.isWebGLSupported()) {
    type = 'Canvas'
  }
  PIXI.utils.sayHello(type)

  // Set up the PIXI app and add it to the html document as a Canvas
  app = new PIXI.Application({width: 1280, height: 720, antialias: true})
  document.body.appendChild(app.view)
}

function startGameHandler () {
  gameStates.play.init(app)
  currentState.remove()
  currentState = gameStates.play
}

function loop () {
  gameStates.start.init(app, startGameHandler)
  currentState = gameStates.start

  // Set State and Start Ticker
  app.ticker.add(delta => gameLoop(delta))

  // Game Loop
  function gameLoop(delta) {
    currentState.loop()
  }

  // // Velocity Updates
  // function play(delta) {

  //   // socket.emit('move', { player_id, x: player.x, y: player.y })
  //   //console.log(player.playing)
  //   // if (barrier !== undefined) {
  //   //   state = end
  //   // }
  // }
}

function destroy () {
  gameStates.start.destroy()
  gameStates.play.destroy()
}
