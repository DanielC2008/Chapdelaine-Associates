'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.post('/api/updateJobStatus', ({body: {jobObj, currJobNum}}, res) => {
  knex('Jobs')
    .returning('job_number')
    .update(jobObj)
    .where({job_number: currJobNum})
    .then( data => res.send({msg: 'Success', job_number: data[0]}))
    .catch( err => res.send({msg: err}))
})

router.get('/api/getCauses', (req, res) => {
  knex('Cause_For_Cancellation').then( data => res.send(data))
})

router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
  knex(`${table}`)
    .update(obj)
    .where(id)
    .then( data => res.send({msg: 'Your data was saved successfully!'}))
    .catch( err => {
      console.log(err)
      res.send({msg: 'Something went wrong! Please try again.'})
    })
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
  knex('Jobs').where('job_number', jobNumber).update('last_accessed', new Date())
    .then(res.send())
    .catch(err => res.send(err))
})

module.exports = router