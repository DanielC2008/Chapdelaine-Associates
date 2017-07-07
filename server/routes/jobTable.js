'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const {validJobType} = require('../validation/validJob')

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

router.post('/api/updateJobStatus', ({body: {jobObj, currJobNum}}, res) => {
  knex('Jobs')
    .returning('job_number')
    .update(jobObj)
    .where({job_number: currJobNum})
    .then( data => res.send({msg: 'Success', job_number: data[0]}))
    .catch( err => res.send({msg: err}))
})

router.post('/api/setNewTab', ({body:{jobNumber, showTab}, session}, res) => {
  let jobIndex = session.recentJobs.findIndex( job => job.jobNumber === jobNumber)
  session.recentJobs[jobIndex].showTab = showTab
  res.send()
})

router.post('/api/setTab', ({body:{jobNumber}, session}, res) => {
  if (session.recentJobs) {
    let jobExists = session.recentJobs.filter( job => job.jobNumber === jobNumber )
    if(jobExists[0]) {
      res.send({showTab: jobExists[0].showTab})
    } else {
      let newObj = {
        jobNumber: jobNumber,
        showTab: 'JobMain'
      }
      session.recentJobs.push(newObj)
      res.send({showTab: 'JobMain'})
    }
  } else {
    let recentJobs = []
    let newObj = {
      jobNumber: jobNumber,
      showTab: 'JobMain'
    }
    recentJobs.push(newObj)
    session.recentJobs = recentJobs
    res.send({showTab: 'JobMain'})
  }
})

router.post('/api/updateLastAccessed', ({body:{jobNumber}}, res) => {
  knex('Jobs')
  .where('job_number', jobNumber)
  .update('last_accessed', new Date())
  .then(res.send())
  .catch(err => res.send(err))
})

/////////////JOB TYPES//////////////////////////////// will move
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

/////////////Cause For Cancellation//////////////////////////////// will move
router.get('/api/getCauses', (req, res) => {
  knex('Cause_For_Cancellation').then( data => res.send(data))
})

router.post('/api/addNewCause', ({body: {dbObj}}, res) => {
    // const errors = validJobType.validate(dbObj, {typecast: true})
    // if (errors[0]) {  //------------------------------------checks each type
      // let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    //   res.status(400).send(msg)
    // } else {
    knex('Cause_For_Cancellation')
    .insert(dbObj)
    .then( () => res.send({msg: 'Successfully added Cause!'}))
    .catch( err => console.log('err', err))
    // }
})

module.exports = router