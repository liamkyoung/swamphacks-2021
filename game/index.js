import keyboard from './keyboard.js'

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
  const player = new PIXI.Sprite(PIXI.Texture.fromImage('res/cat.png'))
  app.stage.addChild(player)

  socket.on('update', data => {
    if (sprites.has(data.id)) {
      sprites.get(data.id).setTransform(data.x, data.y)
    } else {
      sprites.set(data.id, new PIXI.Sprite(PIXI.Texture.fromImage('res/cat.png')))
      app.stage.addChild(sprites.get(data.id))
      sprites.get(data.id).setTransform(data.x, data.y)
    }
  })

  socket.on('player_disconnect', data => {
    app.stage.removeChild(sprites.get(data))
    sprites.delete(data)
  })

  let forward = keyboard('w')
  let backwards = keyboard('s')
  let left = keyboard('a')
  let right = keyboard('d')
  
  player.x = WIDTH / 2
  player.y = HEIGHT / 2
  player.vx = 0
  player.vy = 0
  
  // Forward Movement
  forward.press = () => {
    player.vy = -5
    player.vx = 0
    //console.log('w')
  }
  
  forward.release = () => {
    if (!backwards.isDown && player.vx === 0) {player.vy = 0}
  }
  
  // Backwards Movement
  backwards.press = () => {
    player.vy = 5
    player.vx = 0
    //console.log('s')
  }
  
  backwards.release = () => {
    if (!forward.isDown && player.vx === 0) {player.vy = 0}
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
  state = play
  
  app.ticker.add(delta => gameLoop(delta))
  
  
  // Game Loop
  function gameLoop(delta) {
    state(delta)
  }
  // Velocity Updates
  function play(delta) {
    player.x += player.vx
    player.y += player.vy
    socket.emit('move', {id, x: player.x, y: player.y})
  }
}

