import detectInput from '../detectInput.js'

export default {
  init (app) {
    this.app = app
    this.stage = new PIXI.Container()

    let playerImages = []
    let zombieImages = []
  
    for (let i = 0; i < 20; i++) {
      if (i <= 16) {
        zombieImages.push(PIXI.Texture.from(`res/zombies/skeleton-move_${i}.png`))
      }
      playerImages.push(PIXI.Texture.from(`res/player/rifle/idle/survivor-idle_rifle_${i}.png`))
    }
  
    this.player = new PIXI.AnimatedSprite(playerImages)
    this.player.anchor.x = 0.5
    this.player.anchor.y = 0.5
    this.player.animationSpeed = 0.5
    this.player.play()

    this.player.x = app.renderer.width / 2
    this.player.y = app.renderer.height / 2
    this.player.vx = 0
    this.player.vy = 0

    detectInput(this.player)

    this.stage.addChild(this.player)
    app.stage.addChild(this.stage)

    // socket.on('update', data => {
    //   if (sprites.has(data.player_id)) {
    //     sprites.get(data.player_id).setTransform(data.x, data.y)
    //   } else {
    //     sprites.set(data.player_id, new PIXI.Sprite(PIXI.Texture.fromImage('res/cat.png')))
    //     gameScene.addChild(sprites.get(data.player_id))
    //     sprites.get(data.player_id).setTransform(data.x, data.y)
    //   }
    // })
  
    // socket.on('player_disconnect', data => {
    //   gameScene.removeChild(sprites.get(data))
    //   sprites.delete(data)
    // })
  },
  loop () {
    // Check if Player ran into border wall
    //let barrier = contain(player, { x: 0, y: 0, width: WIDTH, height: HEIGHT })
    // Update Position of Player
    this.player.x += this.player.vx
    this.player.y += this.player.vy
  },
  remove () {

  },
  destroy () {
    
  }
}
