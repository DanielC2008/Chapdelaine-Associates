'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')


router.post('/api/findJob', ({body}, res) => {

  let paramsArr = body

  const querySort = (param, cb) => {
    let objToFind = param.objToFind
    let column = Object.keys(objToFind)
    if (param.table != 'Jobs') {
      let {tableName, connectTable, returningId, findJobId} = DBHelper.getTableInfo(param.table)
      knex(`${tableName}`)
        .select('Jobs.job_number', `${tableName}.${column}` )
        .join(`${connectTable}`, `${connectTable}.${returningId}`, `${tableName}.${returningId}`)
        .join('Jobs', `Jobs.${findJobId}`, `${connectTable}.${findJobId}`)
        .where(objToFind)
        .then( data => cb(data))
    } else {
      if (Object.keys(objToFind)[0] == 'invoice_number') {
        knex('Invoices')
          .select('Jobs.job_number', `${tableName}.${column}` )
          .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
          .where(objToFind)
          .then( data => cb(data)) 
      } else {
        knex('Jobs')
          .select('Jobs.job_number', `${tableName}.${column}` )
          .where(objToFind)
          .then( data => cb(data))
      }
    }
  }

  let matches = paramsArr.map( param => {
    return new Promise((resolve) => {
      querySort(param, resolve)
    })
  })
  
  Promise.all(matches).then( data => res.send(data))

})

module.exports = router