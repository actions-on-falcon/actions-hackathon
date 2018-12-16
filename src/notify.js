import dotenv from 'dotenv'
import google from 'googleapis'
import axios from 'axios'

dotenv.config()

const {PUSH_CLIENT_EMAIL, PUSH_PRIVATE_KEY} = process.env

const jwtClient = new google.auth.JWT(
  PUSH_CLIENT_EMAIL,
  null,
  PUSH_PRIVATE_KEY,
  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
  null,
)

function authorize() {
  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if (err) return reject(err)

      resolve(tokens)
    })
  })
}

class NotifyService {
  async find() {
    return {active: true}
  }

  async create(pass) {
    const {id, uid, name, locale = 'en-US'} = pass

    // prettier-ignore
    console.log('> Sending Notification:', id, 'to', name)

    const tokens = await authorize()

    // code to retrieve target userId and intent
    const notification = {
      userNotification: {
        title: `Your guest ${name} has arrived just now!`,
      },
      target: {
        userId: uid,
        intent: 'guest_arrived',

        // Expects a IETF BCP-47 language code (i.e. en-US)
        locale,
      },
    }

    const endpoint = 'https://actions.googleapis.com/v2/conversations:send'

    const payload = {
      customPushMessage: notification,
    }

    const options = {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }

    const res = await axios.post(endpoint, payload, options)

    console.log('> Notifications Sent:', res.status, res.data)

    return {status: res.status, data: res.data}
  }
}

export default function notifyEndpoint() {
  this.use('notify', new NotifyService())
}
