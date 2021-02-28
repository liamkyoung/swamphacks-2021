'use strict'

function Vector (x, y) {
  this.x = x
  this.y = y
}

Vector.prototype.add = function (x, y) {
  this.x += x
  this.y += y
  return this
}

Vector.prototype.addVec = function (vec) {
  this.x += vec.x
  this.y += vec.y
  return this
}

Vector.prototype.sub = function (x, y) {
  this.x -= x
  this.y -= y
  return this
}

Vector.prototype.subVec = function (vec) {
  this.x -= vec.x
  this.y -= vec.y
  return this
}

Vector.prototype.mul = function (n) {
  this.x *= n
  this.y *= n
  return this
}

Vector.prototype.div = function (n) {
  this.x /= n
  this.y /= n
  return this
}

Vector.prototype.mag = function () {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
}

Vector.prototype.normalize = function () {
  const mag = this.mag()
  if (mag) {
    this.div(mag)
  }
  return this
}

Vector.prototype.copy = function () {
  return new Vector(this.x, this.y)
}

export default Vector
