'use strict'

const { Router } = require('express')

const router = Router()

router.post('/getJob', ({body}, res) => {
  //database call to get everything related to this job
  res.send(body)
})

module.exports = router