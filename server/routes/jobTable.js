'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const { validJob } = require('../validation/validJob')

const locateStatusId = status => {
  return new Promise( (resolve, reject) => {
    knex('Job_Statuses')
    .select('job_status_id')
    .where({job_status: status})
    .then( data => resolve(data[0])).catch( err => console.log('err', err))
  })
}

const locateClientTypeId = type => {
  return new Promise( (resolve, reject) => {
    knex('Client_Types')
    .select('client_type_id')
    .where({client_type: type})
    .then( data => resolve(data[0])).catch( err => console.log('err', err))
  })
}

router.post('/api/createNewJob', ({body: {dbObj}}, res) => {
  let job_types = dbObj.job_type
  delete dbObj.job_type
  Promise.all([
    locateStatusId(dbObj.job_status).then(data => {
      delete dbObj.job_status
      dbObj.job_status_id = data.job_status_id
    }).catch( err => console.log('err', err)),
    locateClientTypeId(dbObj.client_type).then(data => {
      delete dbObj.client_type
      dbObj.client_type_id = data.client_type_id
    }).catch( err => console.log('err', err))
  ]).then( () => {
    knex('Jobs')
    .returning('job_number') 
    .insert(dbObj)
    .then( data => {
      //add job_type
      //function to find all jobtype ids adn put them in array
      //funtion takes array plus job_id, loop over array and put both ids on table
      res.send({job_number: data[0]})
    }).catch( err => console.log(err))
  }).catch( err => console.log('err', err))
})

router.post('/api/updateJobStatus', ({body: {jobObj, currJobNum}}, res) => {
  // //finds status id
  // locateStatusId(jobObj.job_status) 
  // .then( data => {
  //   //if actually changing status id manipulate jobObj 
  //   let job_status_id = data ? data.job_status_id : null
  //   if (job_status_id) {
  //     jobObj.job_status_id = job_status_id
  //     delete jobObj.job_status 
  //   }
  //   knex('Jobs')
  //   .returning('job_number')
  //   .update(jobObj)
  //   .where({job_number: currJobNum})
  //   .then( data => res.send({msg: 'Success', job_number: data[0]})).catch( err => res.send({msg: err}))
  // }).catch( err => console.log('err', err))
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