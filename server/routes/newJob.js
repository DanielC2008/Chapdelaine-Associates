'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')


router.post('/api/getMaxNumber', ({body: {table}}, res) => {
  const {tableName, tableNumber} = DBHelper.getTableInfo(table)
  knex(`${tableName}`)
    .select(knex.raw(`MAX(CAST(${tableNumber} AS INT)) AS max`))
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
  //create invoice and estimate
  let newJob = body

  Promise.all([
    knex.raw('INSERT INTO Invoices OUTPUT Inserted.invoice_id DEFAULT VALUES')
      .then(data => newJob.invoice_id = data[0].invoice_id),
    knex.raw('INSERT INTO Estimates OUTPUT Inserted.estimate_id DEFAULT VALUES')
      .then(data => newJob.estimate_id = data[0].estimate_id)
  ]).then( () => {
    knex('Jobs')
      .insert(newJob)
      .then( () => res.send())
      .catch( err => console.log(err))
  })
})

router.get('/api/getClientsBySearch', ({body}, res) => {
  knex('Clients')
    .select(knex.raw(`first_name + ' ' + last_name AS 'value'`), 'client_id')
    .then( data => res.send(data))
    .catch( err => console.log(err))
})

router.get('/api/getPropertiesBySearch', ({body}, res) => {
  knex('Properties')
    .select(knex.raw(`address AS 'value'`), 'property_id')
    .then( data => res.send(data))
    .catch( err => console.log(err))
})

router.get('/api/getRepresentativesBySearch', ({body}, res) => {
  knex('Representatives')
    .select(knex.raw(`first_name + ' ' + last_name AS 'value'`), 'representative_id')
    .then( data => res.send(data))
    .catch( err => console.log(err))
})

module.exports = router