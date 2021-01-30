import keyboard from './keyboard.js'

const socket = io('ws://localhost:3000')

socket.on('connect', _ => {
  socket.send('hello')
})

socket.on('message', data => {
  console.log(data)
})

const WIDTH = 1280, HEIGHT = 720

// Determine if the web browser supports WebGL
let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}
PIXI.utils.sayHello(type)

// Set up the PIXI app and add it to the html document as a Canvas
let app = new PIXI.Application({width: WIDTH, height: HEIGHT, antialias: true})
document.body.appendChild(app.view)

// Object to contain all the sprites
let sprites = {}
let state

// Load the textures and create new sprites in the sprites Object
const loader = PIXI.Loader.shared
loader.add('cat', 'res/cat.png')
loader.load((loader, res) => {
  sprites.cat = new PIXI.Sprite(res.cat.texture)
  app.stage.addChild(sprites.cat)
})

loader.onComplete.add(_ => {
  let forward = keyboard('w')
  let backwards = keyboard('s')
  let left = keyboard('a')
  let right = keyboard('d')
  
  sprites.cat.x = WIDTH / 2
  sprites.cat.y = HEIGHT / 2
  sprites.cat.vx = 0
  sprites.cat.vy = 0
  
  // Forward Movement
  forward.press = () => {
    sprites.cat.vy = -5
    sprites.cat.vx = 0
    //console.log('w')
  }
  
  forward.release = () => {
    if (!backwards.isDown && sprites.cat.vx === 0) {sprites.cat.vy = 0}
  }
  
  // Backwards Movement
  backwards.press = () => {
    sprites.cat.vy = 5
    sprites.cat.vx = 0
    //console.log('s')
  }
  
  backwards.release = () => {
    if (!forward.isDown && sprites.cat.vx === 0) {sprites.cat.vy = 0}
  }
  
  // Left Movement
  left.press = () => {
    sprites.cat.vx = -5
    sprites.cat.vy = 0
    //console.log('a')
  }
  
  left.release = () => {
    if (!right.isDown && sprites.cat.vy === 0) {sprites.cat.vx = 0}
  }
  
  // Right Movement
  right.press = () => {
    sprites.cat.vx = 5
    sprites.cat.vy = 0
    //console.log('d')
  }
  
  right.release = () => {
    if (!left.isDown && sprites.cat.vy === 0) {sprites.cat.vx = 0}
  }
  state = play
  
  app.ticker.add(delta => gameLoop(delta))
  
  
  // Game Loop
  function gameLoop(delta) {
    state(delta)
  }
  
  // Velocity Updates
  function play(delta) {
    sprites.cat.x += sprites.cat.vx
    sprites.cat.y += sprites.cat.vy
  }
  
})
