'use strict'

import detectInput from '../detectInput.js'

function rotateToPoint (mx, my, px, py) {
  const distY = my - py
  const distX = mx - px
  const angle = Math.atan2(distY, distX)
  return angle
}

export default {
  preInit () {
    this.textures = {}

    const loader = PIXI.Loader.shared
    const assets = new Map()

    function addAnimatedAssetToLoader (name, path, num) {
      for (let i = 0; i < num; i++) {
        loader.add(`${name}_${i}`, `${path}_${i}.png`)
      }
      assets.set(name, num)
    }

    addAnimatedAssetToLoader('rifle_idle', 'res/player/rifle/idle/survivor-idle_rifle', 20)
    addAnimatedAssetToLoader('rifle_move', 'res/player/rifle/move/survivor-move_rifle', 20)
    addAnimatedAssetToLoader('rifle_shoot', 'res/player/rifle/shoot/survivor-shoot_rifle', 3)
    addAnimatedAssetToLoader('feet_idle', 'res/player/feet/idle/survivor-idle', 1)
    addAnimatedAssetToLoader('feet_walk', 'res/player/feet/walk/survivor-walk', 20)
    addAnimatedAssetToLoader('feet_run', 'res/player/feet/run/survivor-run', 20)
    addAnimatedAssetToLoader('feet_strafeLeft', 'res/player/feet/strafe_left/survivor-strafe_left', 20)
    addAnimatedAssetToLoader('feet_strafeRight', 'res/player/feet/strafe_right/survivor-strafe_right', 20)

    function initTextures (loader, res) {
      const textures = this.textures
      assets.forEach((val, key) => {
        const texture = []
        for (let i = 0; i < val; i++) {
          texture.push(res[`${key}_${i}`].texture)
        }
        textures[key] = texture
      })
    }

    loader.onComplete.add(initTextures.bind(this))
  },
  init (app) {
    this.app = app
    this.mousePos = app.renderer.plugins.interaction.mouse.global

    this.player = new PIXI.Container()

    this.body = new PIXI.AnimatedSprite(this.textures.rifle_idle)
    this.feet = new PIXI.AnimatedSprite(this.textures.feet_idle)

    this.body.animationSpeed = 0.4
    this.body.play()

    this.feet.x = 15
    this.feet.y = 75
    this.feet.animationSpeed = 0.4
    this.feet.play()

    this.player.addChild(this.feet)
    this.player.addChild(this.body)



    
    this.player.pivot.x = this.player.width / 2
    this.player.pivot.y = this.player.height / 2
    this.player.x = app.renderer.width / 2
    this.player.y = app.renderer.height / 2
    this.player.vx = 0
    this.player.vy = 0

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
    this.feet.destroy()
    this.body.destroy()
    this.player.destroy()
  }
}
