const server = require('http').createServer()
const io = require('socket.io')(server, {cors: true, origins: ['http://localhost:5000']})

io.on('connection', socket => {
  socket.send('connected!')

  socket.on('message', data => {
    console.log(data)
  })
})

server.listen(3000)
