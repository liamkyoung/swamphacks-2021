'use strict'

import detectInput from '../detectInput.js'

function rotateToPoint (mx, my, px, py) {
  const distY = my - py
  const distX = mx - px
  const angle = Math.atan2(distY, distX)
  return angle
}

export default {
  init (app) {
    this.app = app
    this.mousePos = app.renderer.plugins.interaction.mouse.global

    this.player = new PIXI.AnimatedSprite(PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.animations.player_unarmed)

    this.player.animationSpeed = 0.05
    this.player.width = 125
    this.player.height = 125
    this.player.x = app.renderer.width / 2
    this.player.y = app.renderer.height / 2
    this.player.vx = 0
    this.player.vy = 0

    console.log(this.player.pivot)

    this.player.play()

    detectInput(this.player)

    this.app.stage.addChild(this.player)
  },
  loop () {
    this.player.x += this.player.vx
    this.player.y += this.player.vy
    this.player.rotation = rotateToPoint(this.mousePos.x, this.mousePos.y, this.player.x, this.player.y)
  },
  remove () {
    this.app.stage.removeChild(this.player)
  },
  destroy () {
    this.player.destroy()
  }
}
