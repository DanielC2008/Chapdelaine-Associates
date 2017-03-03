'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

router.post('/api/updateTable', ({body: {table, idObj, columnsToUpdate}}, res) => {
  knex(`${table}`)
    .update(columnsToUpdate)
    .where(idObj)
    .then( data => res.send())
    .catch( err => console.log('err', err))
})

module.exports = router