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
const redis = require('ioredis')
const redisClient = new redis({
  host: 'localhost',
  port: 6379
})

app.get('/streaming', (req, res) => {
  return res.send('This route for WebSocket API!')
})

// Creating a new websocket server
const wss = new WebSocketServer.Server({ server })

// Creating connection using websocket
wss.on('connection', async (ws) => {
  console.log('WebSocket connection established')
  // create connection to redis
  redisClient.on('connect', function () {
    console.log('Connected to Redis')
  })
  // get Bitstamp websocket server and connect
  const tradeDataServer = await bitstampServer()
  await bitstampConnnect(tradeDataServer)

  // sending message to client
  ws.send('Welcome, you are connected!')
  // check which user subscribe currency pair

  // message from client
  ws.on('message', async (data) => {
    console.log(`Client has sent us: ${data}`)
    // send message to Bitstamp server
    await sendMsgToBitstampServer(tradeDataServer, JSON.parse(data))
  })

  // message from Bitstamp server to my socket server
  let id = 1
  tradeDataServer.on('message', async (data) => {
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
        const subscribers = await redisClient.smembers(`${currencyPair}`)

        // send data to each subscriber
        for (let i = 0; i < subscribers.length; i++) {
          ws.send(JSON.stringify(temp))
        }
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
