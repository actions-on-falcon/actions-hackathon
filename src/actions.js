import {dialogflow, SimpleResponse} from 'actions-on-google'
import chalk from 'chalk'

const app = dialogflow({debug: false})

app.intent('welcome', conv => {
  console.log(chalk.green('info:'), 'Hit welcome intent')

  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

app.intent('visiting', conv => {
  console.log(chalk.green('info:'), 'Hit visiting intent')

  console.log(conv)
  const response = new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  })

  conv.ask(response)
})

export default app
