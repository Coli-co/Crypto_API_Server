const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 3000
const routes = require('./routes')

app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
