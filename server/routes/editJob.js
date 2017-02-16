'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


const getTableInfo = table => {
  
  let tableObj = {} 
  switch(table) {
    case 'Clients':
      tableObj.name = 'Clients'
      tableObj.connectTable = 'Jobs_Clients'
      tableObj.returningId = 'client_id'
      break;
    case 'Representatives':
      tableObj.name = 'Representatives'
      tableObj.connectTable = 'Clients_Representatives'
      tableObj.returningId = 'representative_id'
      break;
    case 'Properties':
      tableObj.name = 'Properties'
      tableObj.connectTable = 'Jobs_Properties'
      tableObj.returningId = 'property_id'
      break;
  }
  return tableObj
}



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

router.post('/api/removeFromJob', ({body: {table, objToRemove, job_id}}, res) => {
  let {connectTable} = getTableInfo(table)

  //-----------------------------------------------------------might end up sending job_id with original obj
  knex('Jobs')
    .where(job_id)
    //then remove from the connecting table using both id's
    .then( data => {
      objToRemove.job_id = data[0].job_id
      knex(`${connectTable}`)
        .del()
        .where(objToRemove)
        .then( data => {
          res.send({msg: 'Removed from Job!'})
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})

router.post('/api/addToJob', ({body: {table, objToAdd, job_id}}, res) => {
  let {connectTable} = getTableInfo(table)
  knex('Jobs')
    .where(job_id)
    .then( data => {
      objToAdd.job_id = data[0].job_id
      knex(`${connectTable}`)
        .insert(objToAdd)
        .then( data => {
          res.send(data)
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})


router.post('/api/addNewToJob', ({body: {table, objToAdd, clientId, job_id}}, res) => {
  let {name, returningId, connectTable} = getTableInfo(table)
  let connectTableObj = {}
  // find job number
  knex('Jobs')
    .where(job_id)
    .then( data => {
      connectTableObj.job_id = data[0].job_id
      //make client
      knex(`${name}`)
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
          .then( data => {
            res.send(data)
          }).catch( err => console.log(err))
        }).catch( err => console.log(err))
    }).catch( err => console.log(err))
})






module.exports = router