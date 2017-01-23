'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
  knex(`${table}`)
    .returning('*')
    .update(obj)
    .where(id)
    .then( data => {
      console.log(data);
      res.send({msg: 'Your data was saved successfully!'})
    })
    .catch( err => {
      res.send({msg: 'Something went wrong! Please try again.'})
    })
})

module.exports = router