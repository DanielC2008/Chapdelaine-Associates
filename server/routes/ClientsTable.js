'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')
const locateOrCreate = require('../locateOrCreate')

// router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
//   knex(`${table}`)
//     .update(obj)
//     .where(id)
//     .then( data => res.send({msg: 'Your data was saved successfully!'}))
//     .catch( err => {
//       console.log(err)
//       res.send({msg: 'Something went wrong! Please try again.'})
//     })
// })

// router.post('/api/removeFromJob', ({body: {table, objToRemove, job_id}}, res) => {
//   let {connectTable} = DBHelper.getTableInfo(table)

//   //-----------------------------------------------------------might end up sending job_id with original obj
//   knex('Jobs')
//     .where(job_id)
//     //then remove from the connecting table using both id's
//     .then( data => {
//       objToRemove.job_id = data[0].job_id
//       knex(`${connectTable}`)
//         .del()
//         .where(objToRemove)
//         .then( () => {
//           res.send({msg: 'Removed from Job!'})
//         }).catch( err => console.log(err))
//     }).catch( err => console.log(err))
// })

// router.post('/api/addToJob', ({body: {table, objToAdd, job_id}}, res) => {
//   let {connectTable} = DBHelper.getTableInfo(table)
//   knex('Jobs')
//     .where(job_id)
//     .then( data => {
//       objToAdd.job_id = data[0].job_id
//       knex(`${connectTable}`)
//         .insert(objToAdd)
//         .then( () => {
//           res.send({msg: 'Successfully added to Job!'})
//         }).catch( err => console.log(err))
//     }).catch( err => console.log(err))
// })


router.post('/api/addNewClientToJob', ({body: {objToAdd, job_id}}, res) => {
  let client_type_id
  //get existing state, city, address, county, zip, and client_type
  return Promise.all([
    locateOrCreate.state(objToAdd.state)
    .then( data => {
      delete objToAdd.state
      objToAdd.state_id = data
    }),
    locateOrCreate.city(objToAdd.city).then( data => { 
      delete objToAdd.city
      objToAdd.city_id = data
    }),
    locateOrCreate.address(objToAdd.address).then( data => { 
      delete objToAdd.address
      objToAdd.address_id = data
    }),
    locateOrCreate.county(objToAdd.county).then( data => { 
      delete objToAdd.county
      objToAdd.county_id = data
    }),
    locateOrCreate.zip(objToAdd.zip_code).then( data => { 
      delete objToAdd.zip_code
      objToAdd.zip_id = data
    }),
    locateOrCreate.client_type(objToAdd.client_type).then( data => { 
      delete objToAdd.client_type
      client_type_id = data
    })
  ])
  .then( () => {
    //make client
    knex('Clients')
    .returning('client_id')
    .insert(objToAdd)
    .then( data => {
      //set ids on connecting table
      knex('Clients_Representatives')
      .insert({job_id: `${job_id.job_id}`, client_id: `${data[0]}`, client_type_id: client_type_id}) 
      .then( data => res.send({msg: 'Successfully created and added to Job!'}))
      .catch( err => console.log(err))
    }).catch( err => console.log(err))
  })

})


module.exports = router