class DebugService {
  async find() {
    return {debug: true}
  }
}

export default function debug() {
  this.use('debug', new DebugService())
}
