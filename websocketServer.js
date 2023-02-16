const express = require('express')
const WebSocketServer = require('ws')
const http = require('http')
const {
  bitstampServer,
  bitstampConnnect,
  sendMsgToBitstampServer
} = require('./BitstampAPI')
const app = express()
const port = 3000

const server = http.createServer(app)

app.get('/streaming', (req, res) => {
  return res.send('This route for WebSocket API!')
})

// Creating a new websocket server
const wss = new WebSocketServer.Server({ server })

// Creating connection using websocket
wss.on('connection', async (ws) => {
  console.log('WebSocket connection established')

  // get Bitstamp websocket server and connect
  const tradeDataServer = await bitstampServer()
  await bitstampConnnect(tradeDataServer)

  // sending message to client
  ws.send('Welcome, you are connected!')

  // message from client
  ws.on('message', async (data) => {
    console.log(`Client has sent us: ${data}`)
    // send message to Bitstamp server
    await sendMsgToBitstampServer(tradeDataServer, JSON.parse(data))
  })

  // message from Bitstamp server to my socket server
  let id = 1
  tradeDataServer.on('message', (data) => {
    let result = JSON.parse(data)
    let temp = {}
    if (result.data.id !== undefined) {
      // find the newest deal price by newest id
      id = Math.max(id, result.data.id)
      if (result.data.id === id) {
        let channelSplit = result.channel.split('_')
        let currencyPair = channelSplit[2]
        temp['currencyPair'] = currencyPair
        temp['price'] = result.data.price
        // send newest deal price to client
        ws.send(JSON.stringify(temp))
      }
    }
  })

  // connection closed
  ws.on('close', () => {
    console.log('The client has connected')
  })
  // handling error
  ws.on('error', () => {
    console.log('WebSocket error:', error)
  })
})

server.listen(port, () => {
  console.log('The WebSocket server is listening on port 3000')
})
