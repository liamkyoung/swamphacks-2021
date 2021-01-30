// Determine if the web browser supports WebGL
let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}
PIXI.utils.sayHello(type)

// Set up the PIXI app and add it to the html document as a Canvas
let app = new PIXI.Application({width: 1280, height: 720, antialias: true})
document.body.appendChild(app.view)

// Object to contain all the sprites
let sprites = {}

// Load the textures and create new sprites in the sprites Object
const loader = PIXI.Loader.shared
loader.add('cat', 'res/cat.png')
loader.load((loader, res) => {
  sprites.cat = new PIXI.Sprite(res.cat.texture)
  app.stage.addChild(sprites.cat)
})
