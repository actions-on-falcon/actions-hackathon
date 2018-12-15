import dotenv from 'dotenv'
import Twilio from 'twilio'

dotenv.config()

const {TWILIO_SID, TWILIO_TOKEN} = process.env

const twilio = Twilio(TWILIO_SID, TWILIO_TOKEN)

export default twilio
