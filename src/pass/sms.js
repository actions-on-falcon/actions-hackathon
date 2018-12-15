import twilio from '../common/twilio'

export async function sendMessage(phone, pass) {
  console.log('> Sending SMS to', phone)

  const result = await twilio.messages.create({
    body: 'Siri FastPass',
    to: '+66812390813',
    // from: '+15005550006',
    from: '+19404681908',
  })

  console.log('> SMS has been sent to', phone)

  return result
}
