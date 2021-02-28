'use strict'

import Player from '../player.js'

export default {
  init (app) {
    this.spritesheet = PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet

    this.app = app

    this.backgroundTiling = new PIXI.TilingSprite(this.spritesheet.textures['grass_tile.png'])
    this.backgroundTiling.width = 2000000
    this.backgroundTiling.height = 2000000

    this.backgroundTiling.x = app.renderer.width / 2
    this.backgroundTiling.y = app.renderer.height / 2

    this.boulder = new PIXI.Sprite(this.spritesheet.textures['boulder.png'])
    this.boulder.width = 300
    this.boulder.height = 300
    this.boulder.x = 300
    this.boulder.y = 300
    this.boulder.colRadius = 150

    app.stage.addChild(this.backgroundTiling)
    app.stage.addChild(this.boulder)

    this.player = new Player()
    this.player.add(app.stage)
  },
  loop () {
    this.player.loop(this.app.renderer)
    this.player.checkCollisionCircle(this.boulder.x, this.boulder.y, this.boulder.colRadius)
  },
  remove () {
    this.app.stage.removeChild(this.boulder)
    this.app.stage.removeChild(this.backgroundTiling)
    this.player.remove(this.app.stage)
  },
  destroy () {
    this.boulder.destroy()
    this.backgroundTiling.destroy()
    this.player.destroy()
  }
}
