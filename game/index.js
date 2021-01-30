import keyboard from './keyboard.js'
import contain from './contain.js'

import config from './config.js'

let id = undefined
const WIDTH = 1280, HEIGHT = 720

// Object to contain all the sprites
let sprites = new Map()
let state = undefined
let app = undefined
let openingScene = undefined
let gameScene = undefined
let gameOverScene = undefined

// Initialize socket connection and receive our id and start the game
const socket = io(config.server_address)
socket.on('init', data => {
  id = data
  console.log('connected as ' + id)
  start()
})

// starts the game
function start () {
  initPIXI()
  setup()
  loop()
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
  app = new PIXI.Application({width: WIDTH, height: HEIGHT, antialias: true})
  document.body.appendChild(app.view)
}

function setup() {
  // Game State Container Setup
  openingScene = new PIXI.Container()
  openingScene.visible = true
  app.stage.addChild(openingScene)

  gameScene = new PIXI.Container()
  gameScene.visible = false
  app.stage.addChild(gameScene)

  gameOverScene = new PIXI.Container()
  gameOverScene.visible = false
  app.stage.addChild(gameOverScene)

   // Setting up end
   const style = new PIXI.TextStyle({
    fontFamily: 'Futura',
    fontSize: 64,
    fill: 'white'
  })

  let startMessage = new PIXI.Text('GAME TITLE', style)
  startMessage.x = WIDTH / 2 - (startMessage.width / 2)
  startMessage.y = HEIGHT / 2 - (startMessage.height / 2) - 200

  let endMessage = new PIXI.Text('THE END', style)
  endMessage.x = WIDTH / 2 - (endMessage.width / 2)
  endMessage.y = HEIGHT / 2 - (endMessage.height / 2)


  openingScene.addChild(startMessage)
  gameOverScene.addChild(endMessage)


  // Buttons 
  const playButton = new PIXI.Sprite(PIXI.Texture.fromImage('res/play-button.png'))
  const playButtonDown = PIXI.Texture.fromImage('res/play-button-down.png')
  const playAgain = new PIXI.Sprite(PIXI.Texture.fromImage('res/play-again-button.png'))
  const playAgainDown = PIXI.Texture.fromImage('res/play-again-button-down.png')

  playButton.buttonMode = true
  playButton.interactive = true
  playButton.position.x = WIDTH / 2 - (playButton.width / 2) - 200
  playButton.position.y = HEIGHT / 2 - (playButton.height / 2)

  playButton
    .on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut)

  playAgain.buttonMode = true
  playAgain.interactive = true
  playAgain.position.x = WIDTH / 2
  playAgain.position.y = HEIGHT / 2

  playAgain
    .on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut)

  openingScene.addChild(playButton)
  gameOverScene.addChild(playAgain)

// Button Functionality
function onButtonDown() {
  this.isdown = true
  this.alpha = 1

  if (this.texture === PIXI.Texture.fromImage('res/play-button-down.png')) {
    this.texture = playButtonDown

    openingScene.visible = false
    gameScene.visible = true
    gameOverScene.visible = false
  } else if (this.texture === PIXI.Texture.fromImage('res/play-again-button-down.png')) {
    this.texture = playAgainDown

    openingScene.visible = false
    gameScene.visible = true
    gameOverScene.visible = false
    console.log('reset...')
    // reset ()
  }
}

function onButtonUp() {
  this.isdown = false
  if (this.texture === PIXI.Texture.fromImage('res/play-button-down.png')) {
    if (this.isOver) {
      // texture to test
      this.texture = PIXI.Texture.fromImage('res/play-button.png')
    } else {
      this.texture = PIXI.Texture.fromImage('res/play-button.png')
    }

  } else if (this.texture === PIXI.Texture.fromImage('res/play-again-button-down.png')) {
    if (this.isOver) {
      this.texture = PIXI.Texture.fromImage('res/play-again-button.png')
    } else {
      this.texture = PIXI.Texture.fromImage('res/play-again-button.png')
    }
  }
}

function onButtonOver() {
  this.isOver = true
  if (this.isdown) {
    return
  }
  if (this.texture === PIXI.Texture.fromImage('res/play-button.png')) {
    this.texture = PIXI.Texture.fromImage('res/play-button-down.png')
  } else if (this.texture === PIXI.Texture.fromImage('res/play-again-button.png')) {
    this.texture = PIXI.Texture.fromImage('res/play-again-button-down.png')
  }
}

function onButtonOut() {
  this.isOver = false
    if (this.isdown) {
      return
    }
    if (this.texture === PIXI.Texture.fromImage('res/play-button-down.png')) {
      this.texture = PIXI.Texture.fromImage('res/play-button.png')
    } else if (this.texture === PIXI.Texture.fromImage('res/play-again-button-down.png')) {
      this.texture = PIXI.Texture.fromImage('res/play-again-button.png')
    } 
  }
}

function loop () {
  const player = new PIXI.Sprite(PIXI.Texture.fromImage('res/cat.png'))
  gameScene.addChild(player)

  socket.on('update', data => {
    if (sprites.has(data.id)) {
      sprites.get(data.id).setTransform(data.x, data.y)
    } else {
      sprites.set(data.id, new PIXI.Sprite(PIXI.Texture.fromImage('res/cat.png')))
      gameScene.addChild(sprites.get(data.id))
      sprites.get(data.id).setTransform(data.x, data.y)
    }
  })

  socket.on('player_disconnect', data => {
    gameScene.removeChild(sprites.get(data))
    sprites.delete(data)
  })

  const up = keyboard('w')
  const down = keyboard('s')
  const left = keyboard('a')
  const right = keyboard('d')

  player.x = WIDTH / 2
  player.y = HEIGHT / 2
  player.vx = 0
  player.vy = 0

  // Up Movement
  up.press = () => {
    player.vy = -5
    player.vx = 0
  }

  up.release = () => {
    if (!down.isDown && player.vx === 0) {player.vy = 0}
  }

  // Down Movement
  down.press = () => {
    player.vy = 5
    player.vx = 0
  }

  down.release = () => {
    if (!up.isDown && player.vx === 0) {player.vy = 0}
  }

  // Left Movement
  left.press = () => {
    player.vx = -5
    player.vy = 0
    // console.log('a')
  }

  left.release = () => {
    if (!right.isDown && player.vy === 0) {player.vx = 0}
  }

  // Right Movement
  right.press = () => {
    player.vx = 5
    player.vy = 0
    // console.log('d')
  }

  right.release = () => {
    if (!left.isDown && player.vy === 0) { player.vx = 0 }
  }

  // Set State and Start Ticker
  state = play
  app.ticker.add(delta => gameLoop(delta))

  // Game Loop
  function gameLoop(delta) {
    state(delta)
  }

  // Velocity Updates
  function play(delta) {
    // Check if Player ran into border wall
    let barrier = contain(player, { x: 0, y: 0, width: WIDTH, height: HEIGHT })
    // Update Position of Player
    player.x += player.vx
    player.y += player.vy

    socket.emit('move', { id, x: player.x, y: player.y })

    if (barrier !== undefined) {
      state = end
    }
  }

  function end() {
    openingScene.visible = false
    gameScene.visible = false
    gameOverScene.visible = true
  }
}
