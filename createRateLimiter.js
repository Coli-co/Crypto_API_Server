const redis = require('ioredis')
const moment = require('moment')
const { redisClient } = require('./redisConnect')

async function rateLimiter(key, limit) {
  const item = await redisClient.get(key)

  // add new key to redis
  if (!item) {
    let body = {
      count: 1,
      startTime: moment().unix()
    }
    redisClient.set(key, JSON.stringify(body))
  } else {
    // key exists
    let data = JSON.parse(item)
    let currentTime = moment().unix()
    let difference = (currentTime - data.startTime) / 60

    // check time interval
    if (difference >= 1) {
      redisClient.del(key)
    }
    // check request count
    if (difference < 1) {
      if (data.count > limit) {
        return true
      }
      // update the count and allow the request
      data.count++
      redisClient.set(key, JSON.stringify(data))
    }
  }
}

async function getCountValue(key) {
  const data = await redisClient.get(key)
  const object = JSON.parse(data)

  if (object !== null) {
    return object.count
  }
  return null
}

module.exports = { rateLimiter, getCountValue }
