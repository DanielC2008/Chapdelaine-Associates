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

router.post('/api/removeFromJob', ({body: {table, id, job_number}}, res) => {
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
        .where(id)
        .where(job_id)
        .then( data => {
          res.send()
        })
    })
})

module.exports = router