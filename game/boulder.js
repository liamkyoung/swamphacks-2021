'use strict'

function Boulder (x, y, size, rotation) {
  this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.textures['boulder.png'])
  this.sprite.x = x
  this.sprite.y = y
  this.sprite.width = size
  this.sprite.height = size
  this.sprite.rotation = rotation
  this.sprite.collisionRadius = size / 2
}

Boulder.prototype.add = function (stage) {
  stage.addChild(this.sprite)
}

Boulder.prototype.remove = function (stage) {
  stage.removeChild(this.sprite)
}

Boulder.prototype.destroy = function () {
  this.sprite.destroy()
}

export default Boulder
