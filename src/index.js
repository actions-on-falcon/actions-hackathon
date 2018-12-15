import {dialogflow} from 'actions-on-google'
import bodyParser from 'body-parser'
import express from 'express'
import basicAuth from 'basic-auth-connect'
import dotenv from 'dotenv'

import selfPing from 'heroku-self-ping'

dotenv.config()

selfPing('https://actions-on-falcon.herokuapp.com/')

const server = express()
const app = dialogflow({debug: false})

const {PORT, HTTP_USER, HTTP_PASS} = process.env

server.use(basicAuth(HTTP_USER, HTTP_PASS))

server.use(bodyParser.json())
server.use(app)

server.listen(PORT)
