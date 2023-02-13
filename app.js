const express = require('express')
const app = express()
const port = 3000
const { fetchData } = require('./httpAPI')

app.get('/', (req, res) => {
  res.send('This is Backend pretest server.')
})

app.get('/data', (req, res) => {
  const userId = req.query.user

  if (Number(userId) < 1 || Number(userId) > 1000)
    return res.send({
      error: 'User ID out of range, it should between 1~1000.'
    })

  return fetchData().then((data) => {
    if (!data) return res.send({ status: 500 })
    res.send({ result: data })
  })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
