let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'Canvas'
}

PIXI.utils.sayHello(type)

let app = new PIXI.Application({width: 1280, height: 720})

document.body.appendChild(app.view)
