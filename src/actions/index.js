import {dialogflow, SimpleResponse, BasicCard} from 'actions-on-google'
import basicAuth from 'basic-auth-connect'
import chalk from 'chalk'
import axios from 'axios'

const app = dialogflow({debug: false})

const api = axios.create({
  baseURL: ''
})

function isSpeaker(conv) {
  if(conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'))
    return false
  else
    return true
}

app.intent('welcome', conv => {
  console.log(chalk.green('info:'), 'Hit welcome intent')

  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

app.intent('visiting', conv => {
  console.log(chalk.green('info:'), 'Hit visiting intent')

  var qrcode = 'ABCDEFG'

  // api.post('/api', {
  //   name: conv.parameters.name,
  //   time: conv.parameters.time
  // })
  // .then(
  //   console.log(response)
  // )

  var response

  if(isSpeaker(conv) === false) {
    response = new BasicCard({
      title: 'Visitor access code created!',
      subtitle: 'Code is ' + qrcode,
      image: new Image({
        url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + qrcode,
        alt: qrcode,
      }),
      buttons: new Button({
        title: 'Open on web browser',
        url: 'https://assistant.google.com/',
      }),
    })
  }
  else {
    response = '<speak>Visitor code is created<break time="400ms"/>Your <say-as interpret-as="characters">ID</say-as> is <say-as interpret-as="characters">' + qrcode + '</say-as></speak>'
  }

  conv.ask(response)
})

const {HTTP_USER, HTTP_PASS} = process.env

const httpAuth = basicAuth(HTTP_USER, HTTP_PASS)

export default function debug() {
  this.all('/actions', httpAuth, app)
}
