'use strict'

export default {
  init (app, startGameHandler) {
    this.app = app
    this.stage = new PIXI.Container()

    const style = new PIXI.TextStyle({
      fontFamily: 'Futura',
      fontSize: 64,
      fill: 'white'
    })

    const startMessage = new PIXI.Text('GAME TITLE', style)
    startMessage.x = app.renderer.width / 2 - (startMessage.width / 2)
    startMessage.y = app.renderer.height / 2 - (startMessage.height / 2) - 200

    const playButtonDownTexture = PIXI.Texture.from('res/play-button-down.png')
    const playButtonTexture = PIXI.Texture.from('res/play-button.png')
    const playButton = new PIXI.Sprite(playButtonTexture)

    playButton.buttonMode = true
    playButton.interactive = true
    playButton.position.x = app.renderer.width / 2 - (playButton.width / 2) - 200
    playButton.position.y = app.renderer.height / 2 - (playButton.height / 2)

    playButton.on('pointerdown', onButtonDown).on('pointerup', onButtonUp)

    function onButtonDown () {
      this.texture = playButtonDownTexture
    }

    function onButtonUp () {
      startGameHandler()
      this.texture = playButtonTexture
    }

    this.stage.addChild(playButton)
    this.stage.addChild(startMessage)

    app.stage.addChild(this.stage)
  },
  loop () {
  },
  remove () {
    this.app.stage.removeChild(this.stage)
  },
  destroy () {
    this.stage.destroy()
  }
}
