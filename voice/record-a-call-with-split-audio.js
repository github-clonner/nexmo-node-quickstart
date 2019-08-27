require('dotenv').config({path: __dirname + '/../.env'})


const NEXMO_TO_NUMBER = process.env.NEXMO_TO_NUMBER
const NEXMO_NUMBER = process.env.NEXMO_NUMBER

const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const onInboundCall = (request, response) => {
  const ncco = [{
      action: "record",
      split: "conversation",
      channels: 2,
      eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/recordings`]
    },
    {
      action: "connect",
      from: NEXMO_NUMBER,
      endpoint: [{
        type: "phone",
        number: NEXMO_TO_NUMBER
      }]
    }
  ]
  response.json(ncco)
}

const onRecording = (request, response) => {
  const recording_url = request.body.recording_url
  console.log(`Recording URL = ${recording_url}`)

  response.status(204).send()
}

app
  .get('/webhooks/answer', onInboundCall)
  .post('/webhooks/recordings', onRecording)

app.listen(3000)
