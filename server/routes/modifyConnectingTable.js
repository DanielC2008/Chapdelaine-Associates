'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

router.post('/api/insertIntoConnectingTable', ({body: {table, objToAdd}}, res) => {
  let {connectTable, connectTableId} = DBHelper.getTableInfo(table)
  knex(`${connectTable}`)
    .returning(`${connectTableId}`)
    .insert(objToAdd)
    .then( data => res.send(data))
    .catch( err => console.log('err', err))
})

router.post('/api/updateConnectingTable', ({body: {table, id, columnsToUpdate}}, res) => {
  let {connectTable, connectTableId} = DBHelper.getTableInfo(table)
  knex(`${connectTable}`)
    .update(columnsToUpdate)
    .where(`${connectTableId}`, `${id}`)
    .then( data => res.send())
    .catch( err => console.log('err', err))
})

router.post('/api/deleteFromConnectingTable', ({body: {table, id}}, res) => {
  let {connectTable, connectTableId} = DBHelper.getTableInfo(table)
  knex(`${connectTable}`)
    .del()
    .where(`${connectTableId}`, `${id}`)
    .then( data => res.send())
    .catch( err => console.log('err', err))
})

module.exports = router