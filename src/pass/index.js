import firestore from '../common/firestore'

const passes = firestore.collection('passes')

function generateCode() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 6)
}

class FastPassService {
  async find() {
    const documents = await passes.get()

    const data = documents.docs.map(pass => ({
      id: pass.id,
      ...pass.data(),
    }))

    return {success: true, data}
  }

  async create(data) {
    const code = generateCode()
    const pass = {...data, code}

    await passes.doc(code).set(pass)

    return {success: true, pass}
  }
}

export default function debug() {
  this.use('/pass', new FastPassService())
}
