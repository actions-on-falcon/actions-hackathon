import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import basicAuth from 'basic-auth-connect'
import selfPing from 'heroku-self-ping'

import hello from './hello'
import actions from './actions'

hello()

dotenv.config()

selfPing('https://actions-on-falcon.herokuapp.com/')

const server = express()

const {PORT = 3000, HTTP_USER, HTTP_PASS} = process.env

server.use(basicAuth(HTTP_USER, HTTP_PASS))
server.use(bodyParser.json())

server.use(actions)

server.listen(PORT)
