const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('This is Backend pretest server.')
})

module.exports = router