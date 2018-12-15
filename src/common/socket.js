import socketio from '@feathersjs/socketio'

function handler(io) {
  io.on('connection', socket => {
    // socket.emit('message', 'PING')
    // socket.on('message', data => {})
  })

  io.use((socket, next) => {
    socket.feathers.referrer = socket.request.referrer
    next()
  })
}

const config = {}

export default socketio(config, handler)
