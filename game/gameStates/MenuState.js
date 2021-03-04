'use strict'

function MenuState (width, height, buttonHandler) {
  this.stage = new PIXI.Container()

  const style = new PIXI.TextStyle({
    fontFamily: 'Futura',
    fontSize: 64,
    fill: 'white'
  })

  this.startMessage = new PIXI.Text('GAME TITLE', style)
  this.startMessage.x = width / 2 - (this.startMessage.width / 2)
  this.startMessage.y = height / 2 - (this.startMessage.height / 2) - 200

  const playButtonDownTexture = PIXI.Texture.from('res/play-button-down.png')
  const playButtonTexture = PIXI.Texture.from('res/play-button.png')

  this.playButton = new PIXI.Sprite(playButtonTexture)
  this.playButton.buttonMode = true
  this.playButton.interactive = true
  this.playButton.position.x = width / 2 - (this.playButton.width / 2) - 200
  this.playButton.position.y = height / 2 - (this.playButton.height / 2)

  this.playButton.on('pointerdown', onButtonDown).on('pointerup', onButtonUp)

  function onButtonDown () {
    this.texture = playButtonDownTexture
  }

  function onButtonUp () {
    buttonHandler()
    this.texture = playButtonTexture
  }

  this.stage.addChild(this.playButton)
  this.stage.addChild(this.startMessage)
}

MenuState.prototype.add = function (stage) {
  stage.addChild(this.stage)
}

MenuState.prototype.remove = function (stage) {
  stage.removeChild(this.stage)
}

MenuState.prototype.destroy = function () {
  this.playButton.destroy()
  this.startMessage.destroy()
  this.stage.destroy()
}

export default MenuState
