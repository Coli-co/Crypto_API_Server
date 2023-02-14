const redis = require('ioredis')

const client = new redis({
  host: 'localhost',
  port: 6379
})
client.on('connect', function () {
  console.log('Connected to Redis')
})

async function checkRateLimit(key, limit, expire) {
  let res
  try {
    res = await client.incr(key)
    // check how many seconds are left for the key
    let time = await client.ttl(key)

    // the key does not have an expire time
    if (time === -1) {
      client.expire(key, expire)
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
  const count = await client.get(key)
  return count
}

module.exports = { checkRateLimit, getRedisValue }
