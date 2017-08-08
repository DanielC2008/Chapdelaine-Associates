'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const { validJob } = require('../validation/validJob')

const locateStatusId = status => {
  return new Promise( (resolve, reject) => {
    if (!status) {
      resolve()
    } else {
      knex('Job_Statuses')
      .select('job_status_id')
      .where({job_status: status})
      .then( data => resolve(data[0])).catch( err => console.log('err', err))
    }
  })
}

const locateClientTypeId = type => {
  return new Promise( (resolve, reject) => {
    if (!type) {
      resolve()
    } else {
      knex('Client_Types')
      .select('client_type_id')
      .where({client_type: type})
      .then( data => resolve(data[0])).catch( err => console.log('err', err))
    }
  })
}

router.post('/api/createNewJob', ({body: {dbObj}}, res) => {
  Promise.all([
    locateStatusId(dbObj.job_status).then( data => {
      delete dbObj.job_status
      dbObj.job_status_id = data.job_status_id
    }).catch( err => console.log('err', err)),
    locateClientTypeId(dbObj.client_type).then( data => {
      delete dbObj.client_type
      dbObj.client_type_id = data.client_type_id
    }).catch( err => console.log('err', err))
  ]).then( () => {
    knex('Jobs')
    .returning( ['job_id', 'job_number'])
    .insert(dbObj)
    .then( data => res.send(data[0])).catch( err => console.log(err))
  }).catch( err => console.log('err', err))
})

router.post('/api/updateJob', ({body: {dbObj, job_number}}, res) => {
  Promise.all([
    locateStatusId(dbObj.job_status).then( data => {
      delete dbObj.job_status
      if (data) {
        dbObj.job_status_id = data.job_status_id
      }
    }).catch( err => console.log('err', err)),
    locateClientTypeId(dbObj.client_type).then( data => {
      delete dbObj.client_type
      if (data) {
        dbObj.client_type_id = data.client_type_id
      }
    }).catch( err => console.log('err', err))
  ]).then( () => {
    knex('Jobs')
    .update(dbObj)
    .where({job_number: job_number})
    .then( data => res.send()).catch( err => console.log(err))
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
  .then( () => res.send())
  .catch( err => console.log(err))
})

router.post('/api/checkJobNumberExists', ({body:{job_number}}, res) => {
  knex('Jobs')
  .select('job_number')
  .where({job_number: job_number})
  .then( data => data[0] ? res.send({exists: true}) : res.send({exists: false}))
  .catch( err => console.log(err))
})

module.exports = router