const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var state = 'closed'
client.on('connect', () => {
    client.publish('garagem/controle', 'true')
})

//estado atual dfa porta
function sendStateUpdate () {
    console.log('Enviar status %s', state)
    client.publish('garagem/state', state)
}

client.on('connect', () => {
    client.publish('garagem/connected', 'true')
    sendStateUpdate()
})

client.on('connect', () => {
    client.subscribe('garagem/open')
    client.subscribe('garagem/close')

    client.publish('garagem/connected', 'true')
    sendStateUpdate()
})

client.on('message', (topic, message) =>{
    console.log('recebe mensagem %s %s', topic, message)
})

client.on('message', (topic, message) => {
    console.log('receber mensagem %s %s', topic, message)
    switch (topic) {
      case 'garagem/open':
        return handleOpenRequest(message)
      case 'garagem/close':
        return handleCloseRequest(message)
    }
  })

  function handleOpenRequest (message) {
    if (state !== 'open' && state !== 'opening') {
      console.log('opening garage door')
      state = 'opening'
      sendStateUpdate()
  
      // simulate door open after 5 seconds (would be listening to hardware)
      setTimeout(() => {
        state = 'open'
        sendStateUpdate()
      }, 3000)
    }
  }
  
  function handleCloseRequest (message) {
    if (state !== 'closed' && state !== 'closing') {
      state = 'closing'
      sendStateUpdate()
  
      // simulate door closed after 5 seconds (would be listening to hardware)
      setTimeout(() => {
        state = 'closed'
        sendStateUpdate()
      }, 3000)
    }
  }