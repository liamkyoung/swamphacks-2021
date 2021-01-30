import keyboard from './keyboard.js'
import contain from './contain.js'

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}
PIXI.utils.sayHello(type)

const WIDTH = 1280, HEIGHT = 720
let app = new PIXI.Application({width: WIDTH, height: HEIGHT, antialias: true})
document.body.appendChild(app.view)

let sprites = {}
let state

const loader = PIXI.Loader.shared
loader.add('cat', 'res/cat.png')
loader.load((loader, res) => {
  sprites.cat = new PIXI.Sprite(res.cat.texture)
  app.stage.addChild(sprites.cat)
})

app.renderer.backgroundColor = 0x333333;


// Movement and Game Loop
loader.onComplete.add(_ => {
  // Keyboard Buttons
  let up = keyboard('w')
  let down = keyboard('s')
  let left = keyboard('a')
  let right = keyboard('d')
  
  // Initialize Sprite
  sprites.cat.x = WIDTH / 2
  sprites.cat.y = HEIGHT / 2
  sprites.cat.vx = 0
  sprites.cat.vy = 0

  // Up Movement
  up.press = () => {
    sprites.cat.vy = -5
    sprites.cat.vx = 0
  }
  
  up.release = () => {
    if (!down.isDown && sprites.cat.vx === 0) {sprites.cat.vy = 0}
  }
  
  // Down Movement
  down.press = () => {
    sprites.cat.vy = 5
    sprites.cat.vx = 0
  }
  
  down.release = () => {
    if (!up.isDown && sprites.cat.vx === 0) {sprites.cat.vy = 0}
  }
  
  // Left Movement
  left.press = () => {
    sprites.cat.vx = -5
    sprites.cat.vy = 0
  }
  
  left.release = () => {
    if (!right.isDown && sprites.cat.vy === 0) {sprites.cat.vx = 0}
  }
  
  // Right Movement
  right.press = () => {
    sprites.cat.vx = 5
    sprites.cat.vy = 0
  }
  
  right.release = () => {
    if (!left.isDown && sprites.cat.vy === 0) {sprites.cat.vx = 0}
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
    let barrier = contain(sprites.cat, {x: 0, y: 0, width: WIDTH, height: HEIGHT})
    sprites.cat.x += sprites.cat.vx
    sprites.cat.y += sprites.cat.vy
  }
  
// sprites.cat.x >= 0 && sprites.cat.x <= WIDTH - sprites.cat.width
// sprites.cat.y >= 0 && sprites.cat.y <= HEIGHT - sprites.cat.height

})