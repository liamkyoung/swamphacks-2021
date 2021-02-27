'use strict'

export default {
  init (app) {
    this.app = app
    this.mousePos = app.renderer.plugins.interaction.mouse.global

    this.pressedKeys = {
      w: false,
      s: false,
      a: false,
      d: false
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'w') { // Up
        this.pressedKeys.w = true
      }
      if (e.key === 's') { // Down
        this.pressedKeys.s = true
      }
      if (e.key === 'a') { // Left
        this.pressedKeys.a = true
      }
      if (e.key === 'd') { // Right
        this.pressedKeys.d = true
      }
    })

    window.addEventListener('keyup', e => {
      if (e.key === 'w') { // Up
        this.pressedKeys.w = false
      }
      if (e.key === 's') { // Down
        this.pressedKeys.s = false
      }
      if (e.key === 'a') { // Left
        this.pressedKeys.a = false
      }
      if (e.key === 'd') { // Right
        this.pressedKeys.d = false
      }
    })

    this.coordinateText = new PIXI.Text('X: -, Y: -')

    this.player = new PIXI.AnimatedSprite(PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.animations.player_unarmed)

    this.player.animationSpeed = 0.05
    this.player.width = 80
    this.player.height = 80
    this.player.rotation = -1.5708
    this.player.vx = 0
    this.player.vy = 0

    this.app.stage.addChild(this.coordinateText)
    this.app.stage.addChild(this.player)
  },
  loop () {
    if (this.pressedKeys.w) {
      this.player.vy = -2
    }
    if (this.pressedKeys.s) {
      this.player.vy = 2
    }
    if (this.pressedKeys.a) {
      this.player.vx = -2
    }
    if (this.pressedKeys.d) {
      this.player.vx = 2
    }

    if (!this.pressedKeys.w && !this.pressedKeys.s) {
      this.player.vy = 0
    }
    if (!this.pressedKeys.a && !this.pressedKeys.d) {
      this.player.vx = 0
    }

    if (this.pressedKeys.a || this.pressedKeys.d || this.pressedKeys.w || this.pressedKeys.s) {
      this.player.play()
    } else {
      this.player.gotoAndStop(0)
    }

    this.player.x += this.player.vx
    this.player.y += this.player.vy
    this.player.rotation = Math.atan2(this.mousePos.y - (this.app.renderer.height / 2), this.mousePos.x - (this.app.renderer.width / 2))

    this.coordinateText.text = `X: ${this.player.x}, Y: ${this.player.y}`

    this.coordinateText.pivot.set(-this.player.x + (this.app.renderer.width / 2), -this.player.y + (this.app.renderer.height / 2))
    this.app.stage.pivot.set(this.player.x - (this.app.renderer.width / 2), this.player.y - (this.app.renderer.height / 2))
  },
  remove () {
    this.app.stage.removeChild(this.coordinateText)
    this.app.stage.removeChild(this.player)
  },
  destroy () {
    this.coordinateText.destroy()
    this.player.destroy()
  }
}
