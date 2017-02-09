'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
  knex(`${table}`)
    .returning('*')
    .update(obj)
    .where(id)
    .then( data => {
      res.send({msg: 'Your data was saved successfully!'})
    })
    .catch( err => {
      console.log(err)
      res.send({msg: 'Something went wrong! Please try again.'})
    })
})

router.post('/api/removeFromJob', ({body: {table, objToRemove, job_number}}, res) => {
  //first get job id
  //-----------------------------------------------------------might end up sending job_id with original obj
  knex('Jobs')
    .select('job_id')
    .where(job_number)
    //then remove from the connecting table using both id's
    .then( data => {
      let job_id = data[0]
      knex(`${table}`)
      .del()
        .where(objToRemove)
        .where(job_id)
        .then( data => {
          res.send()
        })
    })
})

router.post('/api/addToJob', ({body: {table, objToAdd, job_number}}, res) => {
  knex('Jobs')
    .select('job_id')
    .where(job_number)
    .then( data => {
      objToAdd.job_id = data[0].job_id
      knex(`${table}`)
        .insert(objToAdd)
        .then( data => {
          res.send(data)
        })
    })
})


router.post('/api/addNewToJob', ({body: {table, objToAdd, job_number}}, res) => {
  let connectTableObj = {}
  // find job number
  knex('Jobs')
    .select('job_id')
    .where(job_number)
    .then( data => {
      connectTableObj.job_id = data[0].job_id
      //make client
      knex(`${table}`)
        .returning('client_id')
        .insert(objToAdd)
        .then( data => {
          connectTableObj.client_id = data[0]
          //set ids on connecting table
          knex('Jobs_Clients')
          .insert(connectTableObj)
          .then( data => {
            res.send(data)
          }).catch( err => console.log(err))
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})






module.exports = router