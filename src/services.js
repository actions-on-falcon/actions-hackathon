import pass from './pass'
import debug from './debug'
import actions from './actions'
import notify from './notify'

export default function(app) {
  app.all('/', (req, res) => res.send({status: 'OK'}))

  app.configure(pass)
  app.configure(debug)
  app.configure(actions)
  app.configure(notify)
}
