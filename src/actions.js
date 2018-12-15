import {dialogflow} from 'actions-on-google'

const app = dialogflow({debug: false})

app.intent('welcome', (conv) => {
  console.log('\x1b[33minfo:\x1b[0m Hit welcome intent');
  conv.ask(new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  }));
});

app.intent('visiting', (conv) => {
  console.log('\x1b[33minfo:\x1b[0m Hit welcome intent');
  conv.ask(new SimpleResponse({
    speech: 'Hello',
    text: 'Hello',
  }));
});

export default app
