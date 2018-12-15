import twilio from '../common/twilio'

function asThaiNumber(phone) {
  // If begin with 0, append +66
  if (phone[0] === '0') {
    return `+66${phone.substr(1)}`
  }

  return phone
}

export async function sendMessage(phone, pass) {
  phone = asThaiNumber(phone)

  console.log('> Sending SMS to', phone)

  const result = await twilio.messages.create({
    body: 'Siri FastPass',
    to: phone,
    from: '+19404681908',
  })

  console.log('> SMS has been sent to', phone)

  return result
}
