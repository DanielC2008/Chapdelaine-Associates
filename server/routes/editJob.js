'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

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

router.post('/api/removeFromJob', ({body: {table, objToRemove, job_id}}, res) => {
  let {connectTable} = DBHelper.getTableInfo(table)

  //-----------------------------------------------------------might end up sending job_id with original obj
  knex('Jobs')
    .where(job_id)
    //then remove from the connecting table using both id's
    .then( data => {
      objToRemove.job_id = data[0].job_id
      knex(`${connectTable}`)
        .del()
        .where(objToRemove)
        .then( () => {
          res.send({msg: 'Removed from Job!'})
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})

router.post('/api/addToJob', ({body: {table, objToAdd, job_id}}, res) => {
  let {connectTable} = DBHelper.getTableInfo(table)
  knex('Jobs')
    .where(job_id)
    .then( data => {
      objToAdd.job_id = data[0].job_id
      knex(`${connectTable}`)
        .insert(objToAdd)
        .then( () => {
          res.send({msg: 'Successfully added to Job!'})
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})


router.post('/api/addNewToJob', ({body: {table, objToAdd, clientId, job_id}}, res) => {
  let {tableName, returningId, connectTable} = DBHelper.getTableInfo(table)
  let connectTableObj = {}
  // find job number
  knex('Jobs')
    .where(job_id)
    .then( data => {
      connectTableObj.job_id = data[0].job_id
      //make client
      knex(`${tableName}`)
        .returning(`${returningId}`)
        .insert(objToAdd)
        .then( data => {
          connectTableObj[returningId] = data[0]
          if (clientId) {
            connectTableObj.client_id = clientId
          }
          //set ids on connecting table
          knex(`${connectTable}`)
          .insert(connectTableObj)
          .then( () => {
            res.send()
          }).catch( err => console.log(err))
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
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