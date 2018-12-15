import cors from 'cors'
import dotenv from 'dotenv'
import selfPing from 'heroku-self-ping'

import log from 'feathers-logger'
import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'

import hooks from './common/hooks'
import logger from './common/logger'
import socket from './common/socket'
import channels from './common/channels'

import services from './services'

dotenv.config()

selfPing('https://actions-on-falcon.herokuapp.com/')

const app = express(feathers())

app.use(cors())

app.use(express.json())
app.configure(express.rest())
app.use(express.urlencoded({extended: true}))

app.configure(socket)

app.configure(log(logger))

const {PORT = 3000} = process.env

app.configure(services)
app.configure(channels)

app.use(express.notFound())
app.use(express.errorHandler({logger}))

app.hooks(hooks)

const server = app.listen(PORT)

server.on('listening', () => {
  console.log(`FassPast Backend is now listening on Port ${PORT}`)
})

process.on('unhandledRejection', (reason, promise) => {
  console.warn('[!!] Unhandled Rejection:', reason, 'at:', promise)
})

function shutdown(code) {
  console.log('[!] Shutting Down:', code)

  process.exit()
}

const shutdownEvents = ['SIGINT', 'SIGQUIT', 'SIGTERM', 'SIGHUP', 'SIGSTP']

shutdownEvents.forEach(event => process.on(event, shutdown))

export default app
