'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/getMaxJob', (req, res) => {
  knex('Jobs')
    .select(knex.raw('MAX(CAST(job_number AS INT)) AS max'))
    .then( data => res.send(data[0]))
    .catch( err => console.log(err))
})

router.get('/api/getMinJob', (req, res) => {
  //get lowest number, returns highest abs value < 0
  knex('Jobs')
    .select(knex.raw('MIN(CAST(job_number AS INT)) AS min'))
    .then( data => res.send(data[0]))
    .catch( err => console.log(err))
})

router.post('/api/createNewJob', ({body}, res) => {
  knex('Jobs')
    .insert(body)
    .then( () => res.send())
    .catch( err => console.log(err))
})

router.get('/api/getClientNames', ({body}, res) => {
  knex('Clients')
    .select(knex.raw(`first_name + ' ' + last_name AS 'value'`))
    //get id???
    .then( data => res.send(data))
    .catch( err => console.log(err))
})

module.exports = router