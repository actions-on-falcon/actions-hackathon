import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import basicAuth from 'basic-auth-connect'
import selfPing from 'heroku-self-ping'

import actions from './actions'

dotenv.config()

selfPing('https://actions-on-falcon.herokuapp.com/')

const server = express()

const {PORT = 3000, HTTP_USER, HTTP_PASS} = process.env

server.use(bodyParser.json())

server.get('/', (req, res) => {
  res.send({status: 'OK'})
})

const httpAuth = basicAuth(HTTP_USER, HTTP_PASS)

server.all('/actions', httpAuth, actions)

server.listen(PORT)
