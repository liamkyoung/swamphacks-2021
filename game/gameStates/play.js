import detectInput from '../detectInput.js'

function rotateToPoint(mx, my, px, py){  
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  return angle;
}

const mousePos = this.app.renderer.plugins.interaction.mouse.global

export default {
  init (app) {
    this.app = app
    this.stage = new PIXI.Container()

    let playerImages = []
  
    for (let i = 0; i < 20; i++) {
      playerImages.push(PIXI.Texture.from(`res/player/rifle/idle/survivor-idle_rifle_${i}.png`))
    }
  
    this.player = new PIXI.AnimatedSprite(playerImages)
    this.player.anchor.x = 0.5
    this.player.anchor.y = 0.5
    this.player.animationSpeed = 0.5
    this.player.play()

    this.player.x = app.renderer.width / 2
    this.player.y = app.renderer.height / 2
    this.player.vx = 0
    this.player.vy = 0

    detectInput(this.player)

    this.stage.addChild(this.player)
    app.stage.addChild(this.stage)
  },
  loop () {
    this.player.x += this.player.vx
    this.player.y += this.player.vy
    this.player.rotation = rotateToPoint(mousePos.x, mousePos.y, this.player.x, this.player.y)
  },
  remove () {
    this.app.stage.removeChild(this.stage)
  },
  destroy () {
    this.stage.destroy()
  }
}
