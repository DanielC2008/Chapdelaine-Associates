'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/findJob', ({body}, res) => {
  // need to decide on some sort of sorting mechanism
})

module.exports = router