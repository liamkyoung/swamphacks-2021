import contain from './contain.js'
import detectInput from './detectInput.js'

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
// let interactionManager = new PIXI.InteractionManager()

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
  // Animated Background Setup
  const titleScreen = new PIXI.Sprite(PIXI.Texture.from('/res/deadops_title.png'))

  //let backgroundImages = []

  //for (let i = 1; i < 170; i++) {
  //  var zerofilled = ('0000'+i).slice(-4);
  //  backgroundImages.push(PIXI.Texture.from(`res/BackgroundMenu/${zerofilled}.png`))
  //}
  //const background = new PIXI.AnimatedSprite(backgroundImages)
  //background.animationSpeed = 0.3
  //background.height = HEIGHT
  //background.width = WIDTH
  
  //background.play()

  // Game State Container Setup
  openingScene = new PIXI.Container()
  openingScene.visible = true
  app.stage.addChild(openingScene)
  openingScene.addChild(titleScreen)

  gameScene = new PIXI.Container()
  gameScene.visible = false
  gameScene.interactive = true
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


  let endMessage = new PIXI.Text('THE END', style)
  endMessage.x = WIDTH / 2 - (endMessage.width / 2)
  endMessage.y = HEIGHT / 2 - (endMessage.height / 2)


  
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

  if (this.texture === playButtonDown) {
    this.texture = playButtonDown
    openingScene.visible = false
    gameScene.visible = true
    gameOverScene.visible = false
  } else if (this.texture === playAgainDown) {
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
  if (this.texture === playButtonDown) {
    this.texture = PIXI.Texture.fromImage('res/play-button.png')
  } else if (this.texture === playAgainDown) {
    this.texture = PIXI.Texture.fromImage('res/play-again-button.png')
  }
}

function onButtonOver() {
  this.isOver = true
  if (this.isdown) {
    return
  }
  if (this.texture === PIXI.Texture.fromImage('res/play-button.png')) {
    this.texture = playButtonDown
  } else if (this.texture === PIXI.Texture.fromImage('res/play-again-button.png')) {
    this.texture = playAgainDown
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

function rotateToPoint(mx, my, px, py){  
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}

function loop () {
  let playerImages = []
  let zombieImages = []

  for (let i = 0; i < 20; i++) {
    if (i <= 16) {
      zombieImages.push(PIXI.Texture.from(`res/zombies/skeleton-move_${i}.png`))
    }
    playerImages.push(PIXI.Texture.from(`res/player/rifle/idle/survivor-idle_rifle_${i}.png`))
  }

  const player = new PIXI.AnimatedSprite(playerImages)
  player.anchor.x = 0.5
  player.anchor.y = 0.5
  player.animationSpeed = 0.5
  player.play()
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

  player.x = WIDTH / 2
  player.y = HEIGHT / 2
  player.vx = 0
  player.vy = 0
  

  detectInput(player)

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
    // let barrier = contain(player, { x: 0, y: 0, width: WIDTH, height: HEIGHT })
    // Update Position of Player
    player.x += player.vx
    player.y += player.vy
    player.rotation = rotateToPoint(app.renderer.plugins.interaction.mouse.global.x, app.renderer.plugins.interaction.mouse.global.y, player.x, player.y)


    socket.emit('move', { id, x: player.x, y: player.y })

    // if (barrier !== undefined) {
    //  state = end
    // }
  }

  function end() {
    openingScene.visible = false
    gameScene.visible = false
    gameOverScene.visible = true
  }
}
