'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
  knex(`${table}`)
    .returning('*')
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

router.post('/api/updateTable', ({body: {table, idObj, columnsToUpdate}}, res) => {
  knex(`${table}`)
    .update(columnsToUpdate)
    .where(idObj)
    .then( data => res.send())
    .catch( err => console.log('err', err))
})



module.exports = router