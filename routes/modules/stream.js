const express = require('express')
const router = express.Router()
const WebSocketServer = require('ws')
const http = require('http')
const {
  bitstampServer,
  bitstampConnnect,
  sendMsgToBitstampServer
} = require('../../WebSocketAPI/BitstampAPI')
const { calculateOHLC } = require('../../WebSocketAPI/oneMinuteOHLC')
const { redisClient } = require('../../Redis/redisConnect.js')
const port = 3005
const server = http.createServer(router)

router.get('/', (req, res) => {
  return res.send('This route for WebSocket API!')
})

// Creating a new websocket server
const wss = new WebSocketServer.Server({ server })

// Creating connection using websocket
wss.on('connection', async (ws) => {
  console.log('WebSocket connection established')
  // create connection to redis

  await redisClient.on('connect', function () {
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

  // assume init id so that it can be compared to newest id
  let id = 1
  // listen message from Bitstamp server and send data to my socket server
  tradeDataServer.on('message', async (data) => {
    let result = JSON.parse(data)

    let temp = {}
    if (result.data.id !== undefined) {
      // update newest deal price by newest id
      id = Math.max(id, result.data.id)
      if (result.data.id === id) {
        let channelSplit = result.channel.split('_')
        let currencyPair = channelSplit[2]
        temp['currencyPair'] = currencyPair
        temp['price'] = result.data.price
        // send newest deal price to client
        const subscribers = await redisClient.smembers(`${currencyPair}`)
        // calculate OHLC for currency pairs
        let OHLC = await calculateOHLC(currencyPair, result)

        // send data to each subscriber
        for (let i = 0; i < subscribers.length; i++) {
          ws.send(JSON.stringify(temp))
          if (OHLC !== undefined) {
            ws.send(JSON.stringify(OHLC))
          }
        }
      }
    }
  })

  // connection closed
  ws.on('close', () => {
    console.log('WebSocket connection closed.')
  })
  // handling error
  ws.on('error', () => {
    console.log('WebSocket error:', error)
  })
})

server.listen(port, () => {
  console.log(`The WebSocket server is listening on port ${port}`)
})

module.exports = router
