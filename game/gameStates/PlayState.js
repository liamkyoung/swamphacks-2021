'use strict'

import Player from '../player.js'
import Boulder from '../boulder.js'

function Play () {
  this.player = new Player()
  this.stage = null

  this.background = new PIXI.TilingSprite(PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.textures['grass_tile.png'])
  this.background.width = 10000
  this.background.height = 10000

  this.boulders = []

  for (let x = 0; x < 30; x++) {
    this.boulders.push(new Boulder(Math.random() * 4000, Math.random() * 4000, Math.random() * 500, 0))
  }
  console.log(this.boulders)
}

Play.prototype.add = function (stage) {
  stage.addChild(this.background)
  this.boulders.forEach((v, i) => {
    v.add(stage)
  })
  this.player.add(stage)
  this.stage = stage
}

Play.prototype.remove = function (stage) {
  stage.removeChild(this.background)
  this.player.remove(stage)
  this.stage = null
}

Play.prototype.loop = function (renderer) {
  this.player.loop(renderer)
  this.boulders.forEach((v, i) => {
    this.player.checkCollisionCircle(v.sprite.x, v.sprite.y, v.sprite.collisionRadius)
  })
}

Play.prototype.destroy = function () {
  this.player.destroy()
}

export default Play
