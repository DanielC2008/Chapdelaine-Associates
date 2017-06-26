'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

//Min/Max
router.post('/api/getMaxNumber', ({body: {table}}, res) => {
  const {tableName, tableNumber} = DBHelper.getTableInfo(table)
  knex(`${tableName}`)
    .select(knex.raw(`MAX(CAST(${tableNumber} AS INT)) AS max`))
    .then( data => res.send(data[0]))
    .catch( err => console.log(err))
})

router.post('/api/getMinNumber', ({body: {table}}, res) => {
  //get lowest number, returns highest abs value < 0
  const {tableName, tableNumber} = DBHelper.getTableInfo(table)
  knex(`${tableName}`)
    .select(knex.raw(`MIN(CAST(${tableNumber} AS INT)) AS min`))
    .then( data => res.send(data[0]))
    .catch( err => console.log(err))
})

//Table
router.post('/api/updateTable', ({body: {table, idObj, columnsToUpdate}}, res) => {
  knex(`${table}`)
    .update(columnsToUpdate)
    .where(idObj)
    .then( data => res.send())
    .catch( err => console.log('err', err))
})


//Connect Table
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