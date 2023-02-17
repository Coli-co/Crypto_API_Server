const { redisClient } = require('./redisConnect')

async function checkRateLimit(key, limit, expire) {
  let res
  try {
    res = await redisClient.incr(key)
    // check how many seconds are left for the key
    let time = await redisClient.ttl(key)

    // the key does not have an expire time
    if (time === -1) {
      redisClient.expire(key, expire)
    }
    if (res > limit) {
      console.log('Rate limit exceeded.')
      return true
    }
  } catch (err) {
    console.error('Check limit error.')
  }
}

async function getRedisValue(key) {
  const count = await redisClient.get(key)
  return count
}

module.exports = { checkRateLimit, getRedisValue }
