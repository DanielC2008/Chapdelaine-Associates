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

// router.post('/api/removeClientFromJob', ({body: {table, objToRemove, job_id}}, res) => {
//   knex('Clients_Representatives')
//     .del()
//     .where(objToRemove)
//     .then( data => res.send({msg: 'Removed from Job!'}))
//     .catch( err => console.log(err))
// })

router.post('/api/addExistingRepToJob', ({body: {objToAdd: {representative_id, job_id, client_id}}}, res) => {
  knex('Clients_Representatives')
      //this update means that there can only be one rep per client per job  
      .update({
        representative_id
      }) 
      .where({
        job_id,
        client_id
      }) 
    .then( () => res.send({msg: 'Successfully added to Job!'}))
    .catch( err => console.log(err))
})


router.post('/api/addNewRepToJob', ({body: {objToAdd, job_id, client_id}}, res) => {
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
    })
  ])
  .then( () => {
    //make rep
    knex('Representatives')
    .returning('representative_id')
    .insert(objToAdd)
    .then( data => {
      //set ids on connecting table
      knex('Clients_Representatives')
       //this update means that there can only be one rep per client per job  
      .update({
        representative_id: `${data[0]}`
      }) 
      .where({
        job_id: job_id,
        client_id: client_id
      }) 
      .then( data => res.send({msg: 'Successfully created and added to Job!'}))
      .catch( err => console.log(err))
    }).catch( err => console.log(err))
  })

})
////This is all extra info for clients when more info is requested we will load it in a new view
// knex('Clients')
//       .select(
//         'Clients.client_id',
//         'Clients.first_name as First Name',
//         'Clients.middle_name as Middle Name',
//         'Clients.last_name as Last Name',
//         'Clients.email as Email',
//         'Clients.business_phone as Business Phone',
//         'Clients.mobile_phone as Mobile Phone',
//         'Clients.home_phone as Home Phone',
//         'Clients.fax_number as Fax Number',
//         'Clients.notes as Notes'
//         // 'Addresses.address',
//         // 'Cities.city',
//         // 'States.state',
//         // 'Zip_Codes.zip',
//         // 'Counties.county'
//       )
//       .join('Jobs_Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
//       .join('Jobs', 'Jobs_Clients.job_id', 'Jobs.job_id')
//       // .join('Addresses', 'Clients.address_id', 'Addresses.address_id')
//       // .join('Cities', 'Clients.city_id', 'Cities.city_id')
//       // .join('States', 'Clients.state_id', 'States.state_id')
//       // .join('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')
//       // .join('Counties', 'Clients.county_id', 'Counties.county_id')
//       .where('Jobs.job_number', job_number)
//       .then(data => {
//         clientID = data.map(client => client.client_id)
//         Job.Clients = data
//       }),


module.exports = router