import keyboard from './keyboard.js'

export default function (sprite) {
  const up = keyboard('w')
  const down = keyboard('s')
  const left = keyboard('a')
  const right = keyboard('d')

  // Up Movement
  up.press = () => {
    sprite.vy = -5
  }

  up.release = () => {
    if (!down.isDown) {sprite.vy = 0}
  }

  // Down Movement
  down.press = () => {
    sprite.vy = 5
  }

  down.release = () => {
    if (!up.isDown) {sprite.vy = 0}
  }

  // Left Movement
  left.press = () => {
    sprite.vx = -5
  }

  left.release = () => {
    if (!right.isDown) {sprite.vx = 0}
  }

  // Right Movement
  right.press = () => {
    sprite.vx = 5
  }

  right.release = () => {
    if (!left.isDown) { sprite.vx = 0 }
  }
}
