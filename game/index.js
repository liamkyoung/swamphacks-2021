let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}
PIXI.utils.sayHello(type)

let app = new PIXI.Application({width: 1280, height: 720, antialias: true})
document.body.appendChild(app.view)

let sprites = {}

const loader = PIXI.Loader.shared
loader.add('cat', 'res/cat.png')
loader.load((loader, res) => {
  sprites.cat = new PIXI.Sprite(res.cat.texture)
  app.stage.addChild(sprites.cat)
})
