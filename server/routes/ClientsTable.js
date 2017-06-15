'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateClient = require('../validation/validClient')
const validationHelper = require('../validation/validationHelper') 
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

router.post('/api/getFullClientById', ({body: {client_id}}, res) => {

  knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name',
        'Clients.email',
        'Clients.home_phone',
        'Clients.business_phone',
        'Clients.mobile_phone',
        'Clients.fax_number',
        'Clients.notes',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip_code',
        'Counties.county',
        'Client_Types.client_type',
        'Client_Specs_Per_Job.main'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Client_Types', 'Client_Specs_Per_Job.client_type_id', 'Client_Types.client_type_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .leftJoin('Addresses', 'Clients.address_id', 'Addresses.address_id')      
      .leftJoin('Cities', 'Clients.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Clients.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')      
      .leftJoin('Counties', 'Clients.county_id', 'Counties.county_id')      
      .where({'Clients. client_id': client_id})
      .then(data => res.send(data[0]))
      .catch(err => console.log('err', err))
})

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
  
  validationHelper.checkNameExists(objToAdd, 'Clients').then( nameExists => {

    const errors = validateClient.validate(objToAdd) 

    if (errors[0]) {  //------------------------------------checks each type
      let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
      res.status(400).send(msg)
      return
    } else if (nameExists) { //-----------------------------checks if name already exists in DB
      res.status(400).send('It appears this name already exists')
      return
    } else {
      let client_type_id
      let main = objToAdd.main
      delete objToAdd.main
      return Promise.all([ //------------------get existing state, city, address, county, zip_code, and client_type
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
        locateOrCreate.zip_code(objToAdd.zip_code).then( data => { 
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
            client_type_id,
            main
          }) 
          .then( data => res.send({msg: 'Successfully created and added to Job!'}))
          .catch( err => console.log(err))
        }).catch( err => console.log(err))
      })

    }
  })

})


router.post('/api/updateClient', ({body: {objToUpdate, id}}, res) => {

  validationHelper.checkNameExistsOnEdit(id, objToUpdate, 'Clients').then( nameExists => {
    
    const errors = validateClient.validate(objToUpdate)
    if (errors[0]) {  //------------------------------------checks each type
      let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
      res.status(400).send(msg)
      return
    } else if (nameExists) { //-----------------------------checks if name already exists in DB
      res.status(400).send('It appears this name already exists')
    } else {

      let specsObj = {} //-----------must seperate main & client_type, they are on a different table

      specsObj.client_type = objToUpdate.client_type
      specsObj.main = objToUpdate.main

      delete objToUpdate.client_type
      delete objToUpdate.main

      console.log('objToUpdate', objToUpdate)
      console.log('specsObj', specsObj)
  //     return Promise.all([ //------------------get existing state, city, address, county, zip_code, and client_type
  //       locateOrCreate.state(objToUpdate.state)
  //       .then( data => {
  //         delete objToUpdate.state
  //         objToUpdate.state_id = data
  //       }),
  //       locateOrCreate.city(objToUpdate.city).then( data => { 
  //         delete objToUpdate.city
  //         objToUpdate.city_id = data
  //       }),
  //       locateOrCreate.address(objToUpdate.address).then( data => { 
  //         delete objToUpdate.address
  //         objToUpdate.address_id = data
  //       }),
  //       locateOrCreate.county(objToUpdate.county).then( data => { 
  //         delete objToUpdate.county
  //         objToUpdate.county_id = data
  //       }),
  //       locateOrCreate.zip_code(objToUpdate.zip_code).then( data => { 
  //         delete objToUpdate.zip_code
  //         objToUpdate.zip_id = data
  //       }),
  //       locateOrCreate.client_type(objToUpdate.client_type).then( data => { 
  //         delete objToUpdate.client_type
  //         client_type_id = data
  //       })

  //     ])
  //     .then( () => {
  //       knex('Clients') //------------------------make client
  //       .returning('client_id')
  //       .insert(objToUpdate)
  //       .then( data => {
  //         let client_id = data[0]
  //         knex('Client_Specs_Per_Job')//------set ids on connecting table
  //         .insert({
  //           job_id,
  //           client_id, 
  //           client_type_id,
  //           main
  //         }) 
  //         .then( data => res.send({msg: 'Successfully created and added to Job!'}))
  //         .catch( err => console.log(err))
  //       }).catch( err => console.log(err))
  //     })

    }
  })

})


module.exports = router