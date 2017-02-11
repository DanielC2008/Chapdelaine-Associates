'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()



//might end up needing this info to be broke out
const getTableInfo = table => {
console.log(table); 
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

router.post('/api/removeFromJob', ({body: {table, objToRemove, job_number}}, res) => {
  let {connectTable} = getTableInfo(table)
  console.log(connectTable, table);
  //first get job id
  //-----------------------------------------------------------might end up sending job_id with original obj
  knex('Jobs')
    .select('job_id')
    .where(job_number)
    //then remove from the connecting table using both id's
    .then( data => {
      objToRemove.job_id = data[0].job_id
      knex(`${connectTable}`)
        .del()
        .where(objToRemove)
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


router.post('/api/addNewToJob', ({body: {table, objToAdd, clientId, job_number}}, res) => {
  let {name, returningId, connectTable} = getTableInfo(table)
  let connectTableObj = {}
  // find job number
  knex('Jobs')
    .select('job_id')
    .where(job_number)
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