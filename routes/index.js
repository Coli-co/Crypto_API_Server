const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const data = require('./modules/data')
const stream = require('./modules/stream')

router.use('/data', data)
router.use('streaming', stream)
router.use('/', home)

module.exports = router
