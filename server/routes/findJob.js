'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')


router.post('/api/findJob', ({body}, res) => {
  console.log(body)
  //loop over array and determine what type of query we are making 
  let paramsArr = body
  paramsArr.forEach( param => {
    let {tableName, connectTable, returningId} = DBHelper.getTableInfo(param.table)
    let objToFind = param.objToFind

  //reps, props, and clients all in one=
  knex(`${tableName}`)
    .select('Jobs.job_number')
    .where(objToFind)
    .join(`${connectTable}`, `${connectTable}.${returningId}`, `${tableName}.${returningId}`)
    .join('Jobs', 'Jobs.job_id', `${connectTable}.job_id`)
    .then( data => console.log('data', data))
  //job by id 
  //job by something else
  //type of work 
  //maybe a switch statement that directs to database based on table
  





  })
  // returns a large obj of the thing requested and the job id

  // for multiple params i need to promise.all
  // after the results come back i need to find matches that are stored in a param queries
  // send those in two groups //found in all params //found in < all params

})

module.exports = router