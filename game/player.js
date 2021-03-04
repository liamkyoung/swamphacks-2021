'use strict'

import Vector from './vector.js'

function Player () {
  this.coordinateText = new PIXI.Text('X: -, Y: -')

  this.playerStationaryTextures = PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.animations.player_stationary
  this.playerWalkingTextures = PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.animations.player_walking

  this.sprite = new PIXI.AnimatedSprite(this.playerStationaryTextures)

  this.sprite.width = 100
  this.sprite.height = 100
  this.sprite.colRadius = 40

  this.sprite.animationSpeed = 0.03

  this.sprite.vx = 0
  this.sprite.vy = 0

  this.sprite.play()

  this.moving = false

  // this.sprite.rotation = -1.5708

  this._initInput()
}

Player.prototype.add = function (stage) {
  stage.addChild(this.coordinateText)
  stage.addChild(this.sprite)
  this.stage = stage
}

Player.prototype.remove = function (stage) {
  stage.removeChild(this.coordinateText)
  stage.removeChild(this.sprite)
  this.stage = null
}

Player.prototype.loop = function (renderer) {
  if (this.keys.w) {
    this.sprite.vy = -2
  }
  if (this.keys.s) {
    this.sprite.vy = 2
  }
  if (this.keys.a) {
    this.sprite.vx = -2
  }
  if (this.keys.d) {
    this.sprite.vx = 2
  }

  if (!this.keys.w && !this.keys.s) {
    this.sprite.vy = 0
  }
  if (!this.keys.a && !this.keys.d) {
    this.sprite.vx = 0
  }

  if (this.keys.a || this.keys.d || this.keys.w || this.keys.s) {
    if (!this.moving) {
      this.moving = true
      this.sprite.textures = this.playerWalkingTextures
      this.sprite.animationSpeed = 0.15
      this.sprite.play()
    }
  } else {
    if (this.moving) {
      this.sprite.textures = this.playerStationaryTextures
      this.sprite.animationSpeed = 0.03
      this.sprite.play()
      this.moving = false
    }
  }

  this.sprite.x += this.sprite.vx
  this.sprite.y += this.sprite.vy

  this.sprite.rotation = Math.atan2(renderer.plugins.interaction.mouse.global.y - (renderer.height / 2), renderer.plugins.interaction.mouse.global.x - (renderer.width / 2)) + ((90 * Math.PI) / 180)

  this.coordinateText.text = `X: ${Math.trunc(this.sprite.x)}, Y: ${Math.trunc(this.sprite.y)}`

  this.coordinateText.pivot.set(-this.sprite.x + (renderer.width / 2), -this.sprite.y + (renderer.height / 2))
  this.stage.pivot.set(this.sprite.x - (renderer.width / 2), this.sprite.y - (renderer.height / 2))
}

Player.prototype.checkCollisionCircle = function (x, y, r) {
  const distanceVector = new Vector(x - this.sprite.x, y - this.sprite.y)
  if (distanceVector.mag() < this.sprite.colRadius + r) {
    const overlap = distanceVector.mag() - (r + this.sprite.colRadius)
    const direction = distanceVector.normalize()
    direction.mul(overlap)
    this.sprite.x += direction.x
    this.sprite.y += direction.y
  }
}

Player.prototype.destroy = function () {
  this.sprite.destroy()
  this.coordinateText.destroy()
}

Player.prototype._initInput = function () {
  this.keys = {
    w: false,
    s: false,
    a: false,
    d: false
  }

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'w') { // Up
      this.keys.w = true
    }
    if (e.key.toLowerCase() === 's') { // Down
      this.keys.s = true
    }
    if (e.key.toLowerCase() === 'a') { // Left
      this.keys.a = true
    }
    if (e.key.toLowerCase() === 'd') { // Right
      this.keys.d = true
    }
  })

  window.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'w') { // Up
      this.keys.w = false
    }
    if (e.key.toLowerCase() === 's') { // Down
      this.keys.s = false
    }
    if (e.key.toLowerCase() === 'a') { // Left
      this.keys.a = false
    }
    if (e.key.toLowerCase() === 'd') { // Right
      this.keys.d = false
    }
  })
}

export default Player
