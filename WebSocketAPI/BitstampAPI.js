const WebSocket = require('ws')
const url = 'wss://ws.bitstamp.net'

const bitstampServer = async () => {
  const BitstampWSS = new WebSocket(url)
  return BitstampWSS
}
async function bitstampConnnect(server) {
  server.on('open', async () => {
    console.log('Bitstamp websocket server connected.')
  })
}

async function sendMsgToBitstampServer(server, clientMsg) {
  await server.send(JSON.stringify(clientMsg))
}

module.exports = {
  bitstampServer,
  bitstampConnnect,
  sendMsgToBitstampServer
}
