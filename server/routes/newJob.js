'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/createNewJob', ({body}, res) => {
  let newJob = body
  //create invoice and estimate
  Promise.all([
    knex.raw('INSERT INTO Invoices OUTPUT Inserted.invoice_id DEFAULT VALUES')
      .then(data => newJob.invoice_id = data[0].invoice_id),
    knex.raw('INSERT INTO Estimates OUTPUT Inserted.estimate_id DEFAULT VALUES')
      .then(data => newJob.estimate_id = data[0].estimate_id)
  ]).then( () => {
    knex('Jobs')
      .insert(newJob)
      .then( () => res.send({msg:'Success'}))
      .catch( err => err.number === 2601 ? res.send({msg: "That number is in use. Please choose another."}) : console.log(err))
  })
})

module.exports = router