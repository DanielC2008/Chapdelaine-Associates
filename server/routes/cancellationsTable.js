'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.get('/api/getCauses', (req, res) => {
  knex('Cancellations').then( data => res.send(data))
})

router.post('/api/addNewCause', ({body: {dbObj}}, res) => {
    // const errors = validJobType.validate(dbObj, {typecast: true})
    // if (errors[0]) {  //------------------------------------checks each type
      // let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    //   res.status(400).send(msg)
    // } else {
    knex('Cancellations')
    .insert(dbObj)
    .then( () => res.send({msg: 'Successfully added Cause!'}))
    .catch( err => console.log('err', err))
    // }
})

module.exports = router