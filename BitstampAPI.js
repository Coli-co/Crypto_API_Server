const WebSocket = require('ws')
const url = 'wss://ws.bitstamp.net'

let currencyPairs = [
  'btcusd',
  'btceur',
  'btcgbp',
  'btcpax',
  'ethbtc',
  'ethusd',
  'etheur',
  'ethgbp',
  'btcusdc',
  'ethusdc'
]

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
