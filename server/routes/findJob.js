'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')


router.post('/api/findJob', ({body}, res) => {
  //loop over array and determine what type of query we are making 
  let paramsArr = body
  paramsArr.forEach( param => {
    let objToFind = param.objToFind

    if (param.table != 'Jobs') {
      let {tableName, connectTable, returningId, findJobId} = DBHelper.getTableInfo(param.table)
      knex(`${tableName}`)
        .select('Jobs.job_number')
        .join(`${connectTable}`, `${connectTable}.${returningId}`, `${tableName}.${returningId}`)
        .join('Jobs', `Jobs.${findJobId}`, `${connectTable}.${findJobId}`)
        .where(objToFind)
        .then( data => console.log('data', data))
    } else {
      knex(`${param.table}`)
        .select('Jobs.job_number')
        .where(objToFind)
        .then( data => console.log('data', data)) 
    }
  })
  // after the results come back i need to find matches that are stored in a param queries
  // send those in two groups //found in all params //found in < all params

})

module.exports = router