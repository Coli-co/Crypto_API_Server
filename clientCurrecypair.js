const redis = require('ioredis')

const currencyPairs = [
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

const userData = [
  {
    name: 'Nicole',
    subscribe: [
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
    ],
    unsubscribe: ['btceur', 'etheur', 'ethgbp']
  },
  {
    name: 'Stephen',
    subscribe: ['ethbtc', 'ethusd', 'etheur', 'ethgbp', 'OHLC'],
    unsubscribe: ['etheur', 'ethgbp']
  },
  {
    name: 'Brandon',
    subscribe: [
      'btcusd',
      'btceur',
      'btcgbp',
      'btcpax',
      'ethbtc',
      'ethusd',
      'etheur',
      'ethgbp',
      'btcusdc',
      'ethusdc',
      'OHLC'
    ],
    unsubscribe: ['btcgbp', 'etheur', 'ethgbp']
  }
]

async function addUserData() {
  const redisClient = await new redis({
    host: 'localhost',
    port: 6379
  })

  redisClient.on('connect', function () {
    console.log('Connected to Redis')
    for (let i = 0; i < userData.length; i++) {
      const subscribeItem = userData[i].subscribe
      const unsubscribeItem = userData[i].unsubscribe
      for (let j = 0; j < subscribeItem.length; j++) {
        redisClient.sadd(subscribeItem[j], userData[i].name)
        if (unsubscribeItem.includes(subscribeItem[j])) {
          redisClient.srem(subscribeItem[j], userData[i].name)
        }
      }
    }
    console.log('User data added to Redis successfully!')
  })
}

addUserData()
