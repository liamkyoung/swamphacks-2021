'use strict'

import Player from '../player.js'

export default {
  preInit () {
    Player.preInit()
  },
  init (app) {
    Player.init(app)
  },
  loop () {
    Player.loop()
  },
  remove () {
    Player.remove()
  },
  destroy () {
    Player.destroy()
  }
}
