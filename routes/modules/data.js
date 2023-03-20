const express = require('express')
const router = express.Router()
const { fetchData } = require('../../HTTPAPI/httpAPI')
const {
  rateLimiter,
  getCountValue
} = require('../../RateLimiting/createRateLimiter')

router.get('/', async (req, res) => {
  let userId = req.query.user
  const ip = req.ip
  let userOverLimit
  let ipOverLimit = await rateLimiter(ip, 10)
  if (userId !== undefined) {
    userOverLimit = await rateLimiter(userId, 5)
  }

  if (ipOverLimit || userOverLimit) {
    return res.status(429).send({
      error: 'Too many requests - try again later',
      ip: await getCountValue(ip),
      id: await getCountValue(userId)
    })
  }
  if (Number(userId) < 1 || Number(userId) > 1000)
    return res.send({
      error: 'User ID out of range, it should between 1~1000.'
    })

  return fetchData().then((data) => {
    if (!data) return res.status(500).send({ error: 'Internal Server Error' })
    res.send({ result: data })
  })
})

module.exports = router
