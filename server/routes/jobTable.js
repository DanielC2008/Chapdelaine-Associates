'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const { validJob } = require('../validation/validJob')

const locateStatusId = status => {
  return new Promise( (resolve, reject) => {
    if (status === undefined) {
      resolve()
    } else { 
      knex('Job_Statuses')
      .select('job_status_id')
      .where({job_status: status})
      .then( data => resolve(data[0])).catch( err => console.log('err', err))
    }
  })
}

router.post('/api/createNewJob', ({body: {dbObj}}, res) => {
  console.log('dbObj', dbObj)
  res.send({job_number: 5009})
  // const errors = validJob.validate(dbObj)
  // if (errors[0]) {  //------------------------------------checks each type
  //   let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
  //   res.status(400).send(msg)
  // } else {
  //   knex('Jobs')
        //returning job_number
  //   .insert(dbObj)
  //   .then( () => res.send({msg:'Success'}))
  //   .catch( err => err.number === 2601 ? res.send({msg: "That number is in use. Please choose another."}) : console.log(err))
  // }
})

router.post('/api/updateJobStatus', ({body: {jobObj, currJobNum}}, res) => {
  //finds status id
  locateStatusId(jobObj.job_status) 
  .then( data => {
    //if actually changing status id manipulate jobObj 
    let job_status_id = data ? data.job_status_id : null
    if (job_status_id) {
      jobObj.job_status_id = job_status_id
      delete jobObj.job_status 
    }
    knex('Jobs')
    .returning('job_number')
    .update(jobObj)
    .where({job_number: currJobNum})
    .then( data => res.send({msg: 'Success', job_number: data[0]})).catch( err => res.send({msg: err}))
  }).catch( err => console.log('err', err))
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

module.exports = router