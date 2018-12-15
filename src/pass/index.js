import {Service as MemoryService} from 'feathers-memory'

class FastPassService extends MemoryService {
  async find(params) {
    const result = await super.find(params)

    return {active: true, result}
  }
}

export default function debug() {
  this.use('/pass', new FastPassService())
}
