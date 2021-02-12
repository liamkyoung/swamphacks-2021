'use strict'

import detectInput from '../detectInput.js'

function rotateToPoint (mx, my, px, py) {
  const distY = my - py
  const distX = mx - px
  const angle = Math.atan2(distY, distX)
  return angle
}

export default {
  init_assets () {
    this.player_rifle_idle = []
    this.player_rifle_move = []

    for (let i = 0; i < 20; i++) {
      this.player_rifle_idle.push(PIXI.Texture.from(`res/player/rifle/idle/survivor-idle_rifle_${i}.png`))
    }
    for (let i = 0; i < 20; i++) {
      this.player_rifle_move.push(PIXI.Texture.from(`res/player/rifle/move/survivor-move_rifle_${i}.png`))
    }
  },
  init (app) {
    this.app = app
    this.stage = new PIXI.Container()
    this.mousePos = app.renderer.plugins.interaction.mouse.global

    this.init_assets()

    this.player = new PIXI.AnimatedSprite(this.player_rifle_idle)
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
    this.app.stage.addChild(this.stage)
  },
  loop () {
    this.player.x += this.player.vx
    this.player.y += this.player.vy
    this.player.rotation = rotateToPoint(this.mousePos.x, this.mousePos.y, this.player.x, this.player.y)
  },
  remove () {
    this.app.stage.removeChild(this.stage)
  },
  destroy () {
    this.stage.destroy()
  }
}
