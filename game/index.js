'use strict'

import MenuState from './gameStates/MenuState.js'
import PlayState from './gameStates/PlayState.js'

// Determine if the web browser supports WebGL
let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}
PIXI.utils.sayHello(type)

// Set up the PIXI app and add it to the html document as a Canvas
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, antialias: true })
document.body.style.margin = '0px'
document.body.appendChild(app.view)

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.Loader.shared.add('res/spritesheet.json')

// Start game when done loading
PIXI.Loader.shared.onComplete.add(start)
PIXI.Loader.shared.load()

function start () {
  const menuState = new MenuState()
  const playState = new PlayState()

  playState.add(app.stage)

  app.ticker.add(delta => gameLoop(delta))

  // Game Loop
  function gameLoop (delta) {
    playState.loop(app.renderer)
  }
}
