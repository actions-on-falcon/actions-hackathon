import {
  dialogflow,
  SimpleResponse,
  BasicCard,
  Image,
  Button,
  Suggestions,
  Confirmation,
} from 'actions-on-google'

import basicAuth from 'basic-auth-connect'
import chalk from 'chalk'

import core from '../index'
import {sendMessage} from '../pass/sms'

const app = dialogflow({debug: false})

function isSpeaker(conv) {
  return !conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')
}

app.intent('welcome', conv => {
  console.log('> Welcome Intent')

  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

app.intent('visiting', async conv => {
  console.log(chalk.green('info:'), 'Hit visiting intent')

  let {time, name} = conv.parameters

  // Normalise name parameter
  if (name['given-name']) name = name['given-name']
  if (typeof name !== 'string') name = String(name)

  const {pass} = await core.service('pass').create({
    name,
    time,
  })

  console.log('Type of time', typeof time, time && time.constructor.name)

  const {code} = pass
  conv.user.storage.pass = pass

  const speech =
    '<speak>The visitor code has been created<break time="400ms"/>Your <say-as interpret-as="characters">ID</say-as> is <say-as interpret-as="characters">' +
    code +
    '</say-as><break time="600ms"/>Which phone number do you want to send the code to?</speak>'

  const text =
    "The visitor's QR code has been created. Which phone number do you want to send the code to?"

  const response = new SimpleResponse({speech, text})
  conv.ask(response)

  if (!isSpeaker(conv)) {
    const card = new BasicCard({
      title: 'Visitor Pass has been created!',
      subtitle: 'Code is ' + code,
      image: new Image({
        url:
          'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' +
          code,
        alt: code,
      }),
      buttons: new Button({
        title: 'View the Visitor Pass',
        url: `https://fastpass.netlify.com/visitor?id=${code}`,
      }),
    })

    conv.ask(card)
  }
})

app.intent('sending', conv => {
  const phone = conv.parameters['phone-number']
  console.log('> SMS Confirmation Intent')
  conv.user.storage.phone = phone
  conv.ask(new Confirmation(`Sending SMS to ${phone}..ready to send?`))
  conv.ask(new Suggestions([`Yes`, `No`]))
})

app.intent('actions.intent.CONFIRMATION', async (conv, confirmation) => {
  const phone = conv.user.storage.phone
  console.log('> SMS Sending Intent')

  if (confirmation) {
    sendMessage(phone, conv.user.storage.pass)
      .then(console.log)
      .catch(console.error)

    const response = new SimpleResponse({
      speech: `<speak>The visitor code has been sent via SMS to the recipient at <say-as interpret-as="character">${phone}</say-as> <break time="400ms"/>You can now say "Exit" to terminate this application</speak>`,
      text: `The visitor code has been sent via SMS to the recipient at ${phone}.`,
    })

    conv.ask(response)

    if (!isSpeaker(conv)) {
      conv.ask(new Suggestions('Exit'))
    }
  } else {
    const response = new SimpleResponse({
      speech: `<speak>Okay! You can start all over again or just say "Exit" to terminate this application`,
      text: `Okay! You can start all over again or just say "Exit" to terminate this application.`,
    })

    conv.ask(response)
  }
})

const {HTTP_USER, HTTP_PASS} = process.env

const httpAuth = basicAuth(HTTP_USER, HTTP_PASS)

export default function debug() {
  this.all('/actions', httpAuth, app)
}
