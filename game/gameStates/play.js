'use strict'

import Player from '../player.js'

export default {
  init (app) {
    this.spritesheet = PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet

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

    app.stage.addChild(this.backgroundTiling)
    app.stage.addChild(this.boulder)

    Player.init(app)
  },
  loop () {
    Player.loop()
  },
  remove () {
    Player.remove()
  },
  destroy () {
    this.environment.destroy()
    this.backgroundTiling.destroy()
    Player.destroy()
  }
}
