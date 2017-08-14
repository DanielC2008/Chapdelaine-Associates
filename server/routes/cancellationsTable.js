'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const { validCause } = require('../validation/validJob')

router.post('/api/validateCause', ({body: {dbObj}}, res) => {
  const errors = validCause.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    res.send({msg: 'Valid Cause'})
  }
})

router.get('/api/getCauses', (req, res) => {
  knex('Cancellations').then( data => res.send(data))
})

router.post('/api/addNewCause', ({body: {dbObj}}, res) => {
  knex('Cancellations')
  .insert(dbObj)
  .then( () => res.send({msg: 'Successfully added Cause!'}))
  .catch( err => console.log('err', err))
})

module.exports = router