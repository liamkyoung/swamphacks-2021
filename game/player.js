'use strict'

import Vector from './vector.js'

function Player () {
  this.coordinateText = new PIXI.Text('X: -, Y: -')

  this.player = new PIXI.AnimatedSprite(PIXI.Loader.shared.resources['res/spritesheet.json'].spritesheet.animations.player_unarmed)
  this.player.animationSpeed = 0.05
  this.player.width = 80
  this.player.height = 80
  this.player.colRadius = 40
  this.player.rotation = -1.5708
  this.player.vx = 0
  this.player.vy = 0
  this.player.lastX = 0
  this.player.lastY = 0
  this.player.colliding = false

  this._initInput()
}

Player.prototype.add = function (stage) {
  stage.addChild(this.coordinateText)
  stage.addChild(this.player)
  this.stage = stage
}

Player.prototype.remove = function (stage) {
  stage.removeChild(this.coordinateText)
  stage.removeChild(this.player)
  this.stage = null
}

Player.prototype.loop = function (renderer) {
  if (this.keys.w) {
    this.player.vy = -2
  }
  if (this.keys.s) {
    this.player.vy = 2
  }
  if (this.keys.a) {
    this.player.vx = -2
  }
  if (this.keys.d) {
    this.player.vx = 2
  }

  if (!this.keys.w && !this.keys.s) {
    this.player.vy = 0
  }
  if (!this.keys.a && !this.keys.d) {
    this.player.vx = 0
  }

  if (this.keys.a || this.keys.d || this.keys.w || this.keys.s) {
    this.player.play()
  } else {
    this.player.gotoAndStop(0)
  }

  this.player.x += this.player.vx
  this.player.y += this.player.vy

  this.player.rotation = Math.atan2(renderer.plugins.interaction.mouse.global.y - (renderer.height / 2), renderer.plugins.interaction.mouse.global.x - (renderer.width / 2))

  this.coordinateText.text = `X: ${Math.trunc(this.player.x)}, Y: ${Math.trunc(this.player.y)}`

  this.coordinateText.pivot.set(-this.player.x + (renderer.width / 2), -this.player.y + (renderer.height / 2))
  this.stage.pivot.set(this.player.x - (renderer.width / 2), this.player.y - (renderer.height / 2))
}

Player.prototype.checkCollisionCircle = function (x, y, r) {
  const distanceVector = new Vector(x - this.player.x, y - this.player.y)
  if (distanceVector.mag() <= this.player.colRadius + r) {
    const overlap = distanceVector.mag() - (r + this.player.colRadius)
    const direction = distanceVector.copy().normalize()
    direction.mul(overlap)
    this.player.x += direction.x
    this.player.y += direction.y
  }
}

Player.prototype.delete = function () {
  this.player.delete()
  this.coordinateText.delete()
}

Player.prototype._initInput = function () {
  this.keys = {
    w: false,
    s: false,
    a: false,
    d: false
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'w') { // Up
      this.keys.w = true
    }
    if (e.key === 's') { // Down
      this.keys.s = true
    }
    if (e.key === 'a') { // Left
      this.keys.a = true
    }
    if (e.key === 'd') { // Right
      this.keys.d = true
    }
  })

  window.addEventListener('keyup', e => {
    if (e.key === 'w') { // Up
      this.keys.w = false
    }
    if (e.key === 's') { // Down
      this.keys.s = false
    }
    if (e.key === 'a') { // Left
      this.keys.a = false
    }
    if (e.key === 'd') { // Right
      this.keys.d = false
    }
  })
}

export default Player
