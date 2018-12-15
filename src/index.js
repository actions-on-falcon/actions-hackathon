import {dialogflow} from 'actions-on-google'
import bodyParser from 'body-parser'
import express from 'express'
import basicAuth from 'basic-auth-connect'
import rp from 'request-promise'
import i18n from 'i18n'
import dotenv from 'dotenv'

dotenv.config()

require('heroku-self-ping')("https://actions-on-falcon.herokuapp.com/")

const app = dialogflow({debug: false});

express()
  .use(basicAuth(process.env.HTTP_USER, process.env.HTTP_PASS))
  .use(bodyParser.json(), app)
  .listen(process.env.PORT);