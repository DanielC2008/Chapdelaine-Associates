'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
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

// router.post('/api/removeClientFromJob', ({body: {objToRemove}}, res) => {
//   knex('Clients_Representatives')
//     .del()
//     .where(objToRemove)
//     .then( data => res.send({msg: 'Removed from Job!'}))
//     .catch( err => console.log(err))
// })

router.post('/api/addNewPropertyToJob', ({body: {objToAdd, job_id}}, res) => {
  let address_id
  let road_id
  return Promise.all([ //------------------get existing state, city, address, county, zip, and road
    locateOrCreate.state(objToAdd.state)
    .then( data => {
      delete objToAdd.state
      objToAdd.state_id = data
    }),
    locateOrCreate.city(objToAdd.city).then( data => { 
      delete objToAdd.city
      objToAdd.city_id = data
    }),
    locateOrCreate.county(objToAdd.county).then( data => { 
      delete objToAdd.county
      objToAdd.county_id = data
    }),
    locateOrCreate.zip(objToAdd.zip_code).then( data => { 
      delete objToAdd.zip_code
      objToAdd.zip_id = data
    }),
    locateOrCreate.address(objToAdd.address).then( data => { 
      delete objToAdd.address
      address_id = data
    }),
    locateOrCreate.road(objToAdd.road).then( data => { 
      delete objToAdd.road
      road_id = data
    })
  ])
  .then( () => {
    knex('Properties') //------------------------make property
    .returning('property_id')
    .insert(objToAdd)
    .then( data => {
      let property_id = data[0]
      return Promise.all([ 
        knex('Jobs_Properties') //-----------------set ids on connecting tables
        .insert({
          job_id,
          property_id
        })
        .then(), 
        knex('Properties_Addresses') 
        .insert({
          address_id,
          property_id
        })
        .then(), 
        knex('Properties_Roads')
        .insert({
          road_id,
          property_id
        })
        .then()
      ])
      .then( data => res.send({msg: 'Successfully created and added to Job!'}))
      .catch( err => console.log(err))

    }).catch( err => console.log(err))

  }).catch( err => console.log(err))

})


module.exports = router