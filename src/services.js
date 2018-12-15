import debug from './debug'
import actions from './actions'

export default function(app) {
  app.all('/', (req, res) => res.send({status: 'OK'}))

  app.configure(debug)
  app.configure(actions)
}
