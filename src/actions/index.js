import chalk from 'chalk'
import basicAuth from 'basic-auth-connect'
import {dialogflow, SimpleResponse} from 'actions-on-google'

const app = dialogflow({debug: false})

app.intent('welcome', conv => {
  console.log(chalk.green('info:'), 'Hit welcome intent')

  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

app.intent('visiting', conv => {
  console.log(chalk.green('info:'), 'Hit welcome intent')

  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

const {HTTP_USER, HTTP_PASS} = process.env

const httpAuth = basicAuth(HTTP_USER, HTTP_PASS)

export default function debug() {
  this.all('/actions', httpAuth, app)
}
