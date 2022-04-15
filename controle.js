const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var garagemState = ''
var connected = false

client.on('connect', () => {
    client.subscribe('garagem/coennected')
    client.subscribe('garagem/state')
})

client.on('message', (topic, message) => {
    switch (topic) {
        case 'garagem/connected':
            return handleGaragemConnected(message)
        case 'garagem/state':
            return handleGaragemState(message)
        }
    console.log('topico nao manipulado %s', topic)
    })

    function handleGaragemConnected (message) {
        console.log('garagem conexao status %s', message)
        connected = (message.toString() === 'true')
    }

    function handleGaragemState (message) {
        garagemState = message
        console.log('garagem status atualizado %s', message)
    }

    function openGaragemDoor (){
        if(connected && garagemState !== 'open') {
            client.publish('garagem/open', 'true')
        }
    }

    function closeGaragemDoor () {
        if(connected && garagemState !== 'closed') {
            client.publish('garagem/close', 'true')
        }
    }

    //simula abertura de garagem
    setTimeout(() => {
        console.log('porta Aberta')
        openGaragemDoor()
    }, 3000)

    //simale fechamento de garagem
    setTimeout(() => {
        console.log('close door')
        closeGarageDoor()
      }, 20000)