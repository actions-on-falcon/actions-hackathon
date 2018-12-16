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

  // If we failed to get the time, use this as fallback text for SMS :)
  let dateText = 'the venue'

  // HACK: Use moment to format time._seconds
  if (time && time._seconds) {
    dateText = moment(Number(`${time._seconds}000`)).format('LLLL')
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
