import moment from 'moment'

import twilio from '../common/twilio'

function asThaiNumber(phone) {
  // If begin with 0, append +66
  if (phone[0] === '0') {
    return `+66${phone.substr(1)}`
  }

  return phone
}

export async function sendMessage(phone, pass) {
  const {name, time, code} = pass
  phone = asThaiNumber(phone)

  console.log('Time is of type', typeof time, time && time.constructor.name)

  let dateText = ''

  if (time && time.toDate) {
    const dateObject = time.toDate()

    dateText = moment(dateObject).format('LLLL')
  }

  // prettier-ignore
  console.log('> Sending SMS to', phone, 'with name:', name, 'with code:', code, 'at time:', time)

  const body = `You have received a visitor pass for Sansiri!
  Your visitor code is ${code}, which you can use for your visit at ${dateText}.
  Please get your pass at https://fastpass.netlify.com/visitor?id=${code} and show them at the venue.`

  const result = await twilio.messages.create({
    body,
    to: phone,
    from: '+19404681908',
  })

  console.log('> SMS has been sent to', phone)

  return result
}
