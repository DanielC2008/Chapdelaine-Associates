'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/getAllTasks', (req, res) => knex('Tasks').then( data => res.send(data)))

module.exports = router