'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/getTypesOfWork', (req, res) => {
  knex('Types_Of_Work').then( data => res.send(data))
})

module.exports = router