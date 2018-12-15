import {Service as MemoryService} from 'feathers-memory'

class FastPassService extends MemoryService {
  async find(params) {
    const result = await super.find(params)

    return {active: true, result}
  }

  async create(data, params) {
    const pass = await super.create(data, params)

    return {pass}
  }
}

export default function debug() {
  this.use('/pass', new FastPassService())
}
