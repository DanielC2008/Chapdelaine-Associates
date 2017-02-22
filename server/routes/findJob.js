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
      var {tableName, connectTable, returningId} = DBHelper.getTableInfo(param.table)
    }else {
      var tableName = param.table
    }
    
    if (tableName == 'Clients' || tableName == 'Representatives' || tableName == 'Properties'){
      knex(`${tableName}`)
        .select('Jobs.job_number')
        .join(`${connectTable}`, `${connectTable}.${returningId}`, `${tableName}.${returningId}`)
        .join('Jobs', 'Jobs.job_id', `${connectTable}.job_id`)
        .where(objToFind)
        .then( data => console.log('data', data))
    } else if (tableName  == 'Jobs') {
        knex(`${tableName}`)
          .select('Jobs.job_number')
          .where(objToFind)
          .then( data => console.log('data', data)) 
    } else if (tableName == 'Types_Of_Work') {
        knex(`${tableName}`)
          //get type of work id
          .select('Types_Of_Work.type_of_work_id')
          .where(objToFind)
          .then( data => {
            let type_of_work_id = data[0]
            knex('Types_Invoices')
              .select('Jobs.job_number')
              .join('Jobs', 'Jobs.invoice_id', 'Types_Invoices.invoice_id')
              .where(type_of_work_id)
              .then( data => console.log('data', data))
          })

    }
  
  })
  // returns a large obj of the thing requested and the job id

  // for multiple params i need to promise.all
  // after the results come back i need to find matches that are stored in a param queries
  // send those in two groups //found in all params //found in < all params

})

module.exports = router