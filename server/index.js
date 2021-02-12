const io = require('socket.io')({ cors: { origin: '*' } })

io.on('connection', socket => {
  console.log(socket.id + ' connected')

  socket.emit('init', socket.id)

  socket.on('move', data => {
    socket.broadcast.emit('update', data)
  })

  socket.on('disconnect', _ => {
    socket.broadcast.emit('player_disconnect', socket.id)
  })
})

io.listen(3000)
