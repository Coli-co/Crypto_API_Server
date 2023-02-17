const { redisClient } = require('./redisConnect.js')

async function calculateOHLC(currencyPair, result) {
  let key = `one_minute_OHLC_${currencyPair}`
  let item = await redisClient.get(key)
  // current price of live ticker
  let price = result.data.price
  let microTimestamp = Number(result.data.microtimestamp)

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
    let timeData = data // keep data in one minute

    // there is no key property of microTimestamp after returning value, if invoke again, we have to add this so that it can be compare with incoming microTimestamp
    if (!data.microtimestamp) {
      data.microtimestamp = microTimestamp
      redisClient.set(key, JSON.stringify(data))
    }
    let diffTimeInSeconds = (microTimestamp - data.microtimestamp) / 1000000

    let diffTimeInMinute = diffTimeInSeconds / 60
    let diffTimeIntegerMinute = Math.floor(diffTimeInMinute)

    // update price any time
    data.high = Math.max(price, data.high)
    data.low = Math.min(price, data.low)
    data.close = price
    //update redis current data
    redisClient.set(key, JSON.stringify(data))

    // time's up or over (one minute)
    if (diffTimeIntegerMinute === 1) {
      // seconds over one minute
      if (diffTimeInMinute > 1) {
        delete timeData.microtimestamp

        redisClient.set(key, JSON.stringify(timeData))
        return timeData
      }
      // equal one minute exactly

      // data.close = price
      delete data.microtimestamp
      redisClient.set(key, JSON.stringify(data))

      return data
    }
  }
}

module.exports = { calculateOHLC }
