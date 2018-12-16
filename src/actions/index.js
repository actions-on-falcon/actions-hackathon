import {
  dialogflow,
  SimpleResponse,
  BasicCard,
  Image,
  Button,
  Suggestions,
  Confirmation,
  UpdatePermission,
} from 'actions-on-google'

import basicAuth from 'basic-auth-connect'
import chalk from 'chalk'
import moment from 'moment'
import {Timestamp} from '@google-cloud/firestore'

import firestore from '../common/firestore'

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

  const uid = conv.request.user.userId
  console.log('> User ID =', uid)

  // Parse time as timestamp object
  if (typeof time === 'string') {
    const date = new Date(time)

    // If date is actually NaN
    if (isNaN(date)) time = new Date()

    const timestamp = Timestamp.fromDate(date)

    // If seconds exist, use that.
    if (timestamp.seconds) time = timestamp
  }

  const {pass} = await core.service('pass').create({
    uid,
    name,
    time,
  })

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

  // prettier-ignore
  const confirmation = new Confirmation(`Sending SMS to ${phone}. Are you ready to send?`)

  conv.ask(confirmation)
})

app.intent('confirmation', (conv, input, confirmation) => {
  const phone = conv.user.storage.phone
  console.log('> SMS Sending Intent')

  console.log('Confirmation', confirmation, 'Phone', phone)

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
      conv.ask(new Suggestions(['Alert me when he arrive', 'Exit']))
    }
  } else {
    const response = new SimpleResponse({
      speech: `<speak>Okay! You can start all over again or just say "Exit" to terminate this application`,
      text: `Okay! You can start all over again or just say "Exit" to terminate this application.`,
    })

    conv.ask(response)
  }
})

app.intent('setup_push', conv => {
  console.log('> Setup Push Intent')

  conv.ask(new UpdatePermission({intent: 'guest_arrived'}))
})

app.intent('finish_push_setup', conv => {
  console.log('> Finish Push Intent')

  if (conv.arguments.get('PERMISSION')) {
    const userID = conv.arguments.get('UPDATES_USER_ID')
    console.log('> Updates User ID', userID)

    // TODO: save userID in DB
    conv.close(`Ok, I'll start alerting you.`)
  } else {
    conv.close(`Ok, I won't alert you.`)
  }
})

app.intent('guest_arrived', conv => {
  console.log('> Guest Arrived invoked')
})

app.intent('alert', async conv => {
  const uid = conv.request.user.userId
  const passes = firestore.collection('passes')

  // TODO: check user who visiting today via Firebase and store name into array called guests
  const documents = await passes.where('uid', '==', uid).get()

  const guests = documents.docs.map(pass => ({
    id: pass.id,
    ...pass.data(),
  }))

  console.log('> Guests for', uid, 'is', guests)

  let speak = ``
  let text = ``

  if (guests.length === 0) {
    speak += `<speak>There aren't any visitors today.</speak>`
    text += `There aren't any visitors today.`
  } else {
    speak += `<speak>Here are the guests who will be visiting you today.<break time="400ms"/>`
    text += `Here are the guests who will be visiting you today.`

    guests.forEach(guest => {
      const {name, time} = guest
      let dateText = 'today'

      if (time && time._seconds) {
        // prettier-ignore
        dateText = `at ${moment(Number(`${time._seconds}000`)).format('h:mm A')}`
      }

      speak += `${name} will visit you ${dateText}. <break time="200ms"/>`
      text += `${name} will visit you ${dateText}.`
    })

    speak += '</speak>'
  }

  const response = new SimpleResponse({
    speech: speak,
    text: text,
  })

  conv.ask(response)
})

const {HTTP_USER, HTTP_PASS} = process.env

const httpAuth = basicAuth(HTTP_USER, HTTP_PASS)

export default function debug() {
  this.all('/actions', httpAuth, app)
}
