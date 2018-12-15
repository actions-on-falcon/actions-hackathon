import {sendMessage} from './pass/sms'

class DebugService {
  async find() {
    return {debug: true}
  }

  async create({phone, pass}) {
    if (!phone || !pass) return {success: false}

    const data = await sendMessage(phone, pass)

    return {success: true, data}
  }
}

export default function debug() {
  this.use('debug', new DebugService())
}
