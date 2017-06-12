'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateClient = require('../validation/validClient')
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

router.post('/api/removeClientFromJob', ({body: {objToRemove}}, res) => {
  knex('Client_Specs_Per_Job')
    .del()
    .where(objToRemove)
    .then( data => res.send({msg: 'Removed from Job!'}))
    .catch( err => console.log(err))
})

router.post('/api/addExistingClientToJob', ({body: {objToAdd}}, res) => {
  knex('Client_Specs_Per_Job')
    .insert(objToAdd)
    .then( () => res.send({msg: 'Successfully added to Job!'}))
    .catch( err => console.log(err))
})


router.post('/api/addNewClientToJob', ({body: {objToAdd, job_id}}, res) => {

  const errors = validateClient.validate(objToAdd)
  if (errors[0]) {
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
    return
  }

  let client_type_id
  return Promise.all([ //------------------get existing state, city, address, county, zip, and client_type
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
    knex('Clients') //------------------------make client
    .returning('client_id')
    .insert(objToAdd)
    .then( data => {
      let client_id = data[0]
      knex('Client_Specs_Per_Job')//------set ids on connecting table
      .insert({
        job_id,
        client_id, 
        client_type_id
      }) 
      .then( data => res.send({msg: 'Successfully created and added to Job!'}))
      .catch( err => console.log(err))
    }).catch( err => console.log(err))
  })

})


module.exports = router