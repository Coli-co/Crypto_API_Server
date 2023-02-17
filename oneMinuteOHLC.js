const redis = require('ioredis')
const redisClient = new redis({
  host: 'localhost',
  port: 6379
})

async function calculateOHLC(currencyPair, result) {
  let key = `one_minute_OHLC_${currencyPair}`
  let item = await redisClient.get(key)
  // current price of live ticker
  let price = result.data.price
  let microTimestamp = Number(result.data.microtimestamp)
  console.log('outer timstamp:', microTimestamp)
  if (!item) {
    let body = {
      open: price,
      high: price,
      low: price,
      close: price,
      microtimestamp: microTimestamp
    }
    redisClient.set(key, JSON.stringify(body))
  } else {
    // key exists
    let data = JSON.parse(item)
    console.log('inner timstamp:', data.microtimestamp)
    // there is no key property of microTimestamp after returning value, if invoke again, we have to add this so that it can be compare with incoming microTimestamp
    if (!data.microtimestamp) {
      data.microtimestamp = microTimestamp
      redisClient.set(key, JSON.stringify(data))
    }
    let diffTimeInSeconds = (microTimestamp - data.microtimestamp) / 1000000

    let diffTimeInMinute = Math.floor(diffTimeInSeconds / 60)

    // update high and low price at any time
    data.high = Math.max(price, data.high)
    data.low = Math.min(price, data.low)
    //update redis current data
    redisClient.set(key, JSON.stringify(data))
    // time's up (one minute)，update close price
    if (diffTimeInMinute === 1) {
      data.close = price
      delete data.microtimestamp
      redisClient.set(key, JSON.stringify(data))

      return data
    }
  }
}

module.exports = { calculateOHLC }
