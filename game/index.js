import keyboard from './keyboard.js'
import contain from './contain.js'

let id = undefined
const WIDTH = 1280, HEIGHT = 720

// Object to contain all the sprites
let sprites = new Map()
let state = undefined
let app = undefined

// Initialize socket connection and receive our id and start the game
const socket = io('ws://localhost:3000')
socket.on('init', data => {
  id = data
  console.log('connected as ' + id)
  start()
})

// starts the game
function start () {
  initPIXI()
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

function loop () {
  let gameScene = new PIXI.Container()
  app.stage.addChild(gameScene)

  let gameOverScene = new PIXI.Container()
  app.stage.addChild(gameOverScene)

  let style = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  })

  let endMessage = new PIXI.Text("THE END", style)
  gameOverScene.addChild(endMessage)

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

  let up = keyboard('w')
  let down = keyboard('s')
  let left = keyboard('a')
  let right = keyboard('d')
  
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
    //console.log('a')
  }
  
  left.release = () => {
    if (!right.isDown && player.vy === 0) {player.vx = 0}
  }
  
  // Right Movement
  right.press = () => {
    player.vx = 5
    player.vy = 0
    //console.log('d')
  }
  
  right.release = () => {
    if (!left.isDown && player.vy === 0) {player.vx = 0}
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
    let barrier = contain(player, {x: 0, y: 0, width: WIDTH, height: HEIGHT})
    // Update Position of Player
    player.x += player.vx
    player.y += player.vy

    socket.emit('move', {id, x: player.x, y: player.y})
    
    if (barrier !== undefined) {
      state = end
    }
  }
  
  function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
  }
})
