import dotenv from 'dotenv'
import {Firestore} from '@google-cloud/firestore'

dotenv.config()

const {CLIENT_EMAIL, PRIVATE_KEY} = process.env

const firestore = new Firestore({
  projectId: 'fastpass',
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: JSON.parse(`"${PRIVATE_KEY}"`),
  },
})

firestore.settings({timestampsInSnapshots: true})

export default firestore
