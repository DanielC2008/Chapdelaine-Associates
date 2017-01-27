'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/getMaxJob', (req, res) => {
  knex('Jobs')
    .max('job_number as last')
    .then( data => {
      res.send(data[0])
    })
    .catch( err => {
      console.log(err)
    })
})

module.exports = router