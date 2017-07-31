'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const {validJobType} = require('../validation/validJob')


router.post('/api/addJobTypeToJob', ({body: {job_type, job_id}}, res) => { // ensure this doesnt happen twice
  knex('Job_Types')
  .select('job_type_id')
  .where({'job_type': job_type})
  .then( data => {
    let job_type_id = data[0].job_type_id
    knex('Jobs_Job_Types')
    .insert({job_id: job_id, job_type_id: job_type_id})
    .then( () => res.send()).catch( err => console.log('err', err))
  })
})

router.get('/api/getEnabledJobTypes', (req, res) => {
  knex('Job_Types')
  .where({disabled: false})
  .orderBy('priority', 'asc')
  .then( data => res.send(data))
  .catch(err => console.log('err', err))
})

router.post('/api/addNewJobType', ({body: {dbObj}}, res) => {
  //add Priority
  getLastPriority().then( last => {
    dbObj.priority = last[0].priority + 1
    const errors = validJobType.validate(dbObj, {typecast: true})
    if (errors[0]) {  //------------------------------------checks each type
      let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
      res.status(400).send(msg)
    } else {
      knex('Job_Types')
      .insert(dbObj)
      .then( () => res.send({msg: 'Successfully added job type!'}))
      .catch( err => console.log('err', err))
    }
  })
})

router.post('/api/reprioritizeJobTypes', ({body: {dbPackage}}, res) => {
  dbPackage.forEach( dbObj => {
    knex('Job_Types')
    .update({priority: dbObj.priority}) 
    .where({job_type_id: dbObj.job_type_id})
    .then( () => res.send({msg: 'Successfully updated priority!'}))
    .catch( err => console.log('err', err))
  })
})

router.post('/api/disableJobType', ({body: {id}}, res) => {
  knex('Job_Types')
  .update({disabled: true})
  .where({job_type_id: id})
  .then( () => res.send({msg: 'Successfully disabled Job Type!'}))
  .catch( err => console.log('err', err))  
})

const getLastPriority = () => {
  return new Promise ((resolve, reject) => {
    knex('Job_Types')
    .max('priority as priority')
    .then( data => resolve(data))
    .catch( err => reject(err))
  })  
}

module.exports = router