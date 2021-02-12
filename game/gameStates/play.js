'use strict'

import Player from '../player.js'

export default {
  init (app) {
    this.app = app

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
