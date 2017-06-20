'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateClient = require('../validation/validClient')
const validationHelper = require('../validation/validationHelper') 

router.post('/api/getFullClientOnJob', ({body: {ids}}, res) => { // on update bc includes jobid
  const client_id = ids.client_id
  const job_id = ids.job_id
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
  .where({'Clients.client_id': client_id})
  .andWhere({'Jobs.job_id': job_id})
  .then(data => res.send(data[0]))
  .catch(err => console.log('err', err))
}) 

router.post('/api/getFullClientById', ({body: {client_id}}, res) => { //on new bc no job associated yet
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
    'Counties.county'
  )
  .leftJoin('Addresses', 'Clients.address_id', 'Addresses.address_id')      
  .leftJoin('Cities', 'Clients.city_id', 'Cities.city_id') 
  .leftJoin('States', 'Clients.state_id', 'States.state_id')      
  .leftJoin('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')      
  .leftJoin('Counties', 'Clients.county_id', 'Counties.county_id')      
  .where({'Clients.client_id': client_id})
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

router.post('/api/addNewClientToJob', ({body: {dbObj, ids}}, res) => {
  const job_id = ids.job_id
  const errors = validateClient.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    validationHelper.checkNameExists(dbObj, 'Clients').then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send(nameExists)
      } else {
        let main = dbObj.main
        delete dbObj.main
        getConnectTableIds(dbObj).then( data => {
          let client_type_id = data.client_type_id
          let polishedObj = data.obj
          knex('Clients') //------------------------make client
          .returning('client_id')
          .insert(polishedObj)
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
  }
})

router.post('/api/addExistingClientToJob', ({body: {dbObj, ids}}, res) => {
  const client_id = ids.client_id
  const job_id = ids.job_id
  const errors = validateClient.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    validationHelper.checkNameExistsOnEdit({client_id: ids.client_id}, dbObj, 'Clients')
    .then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send(nameExists)
      } else {
        let main = dbObj.main
        delete dbObj.main
        getConnectTableIds(dbObj).then( data => {
          let client_type_id = data.client_type_id
          let polishedObj = data.obj
          knex('Clients') //------------------------find client
          .update(polishedObj)
          .where({client_id: client_id})
          .then( () => {
            knex('Client_Specs_Per_Job')//------set ids on connecting table
            .insert({
              job_id,
              client_id, 
              client_type_id,
              main
            }) 
            .then( data => res.send({msg: 'Successfully added to Job!'}))
            .catch( err => console.log(err))
          }).catch( err => console.log(err))        
        })
      }
    })
  }
})

router.post('/api/updateClient', ({body: {dbObj, ids}}, res) => { // start here
  const client_id = {client_id: ids.client_id}
  const job_id = {job_id: ids.job_id}
  const errors = validateClient.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    validationHelper.checkNameExistsOnEdit(client_id, dbObj, 'Clients')
    .then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send(nameExists)
      } else {
        let main = dbObj.main
        delete dbObj.main
        getConnectTableIds(dbObj).then( data => {
          let client_type_id = data.client_type_id
          let polishedObj = data.obj
          knex('Clients') //------------------------find client
          .update(polishedObj)
          .where(client_id)
          .then( () => {
            knex('Client_Specs_Per_Job')//------set ids on connecting table
            .update({
              client_type_id, 
              main
            })
            .where(client_id)
            .andWhere(job_id)
            .then( data => res.send({msg: 'Successfully updated Job!'}))
            .catch( err => console.log(err))
          }).catch( err => console.log(err))        
        })
      }
    })
  }
})



const getConnectTableIds = obj => {
  let dbPackage = {}
  let client_type_id
  return new Promise( (resolve, reject) => {
    Promise.all([ //------------------get existing state, city, address, county, zip_code, and client_type
      locateOrCreate.state(obj.state).then( data => {
        delete obj.state
        obj.state_id = data
      }),
      locateOrCreate.city(obj.city).then( data => { 
        delete obj.city
        obj.city_id = data
      }),
      locateOrCreate.address(obj.address).then( data => { 
        delete obj.address
        obj.address_id = data
      }),
      locateOrCreate.county(obj.county).then( data => { 
        delete obj.county
        obj.county_id = data
      }),
      locateOrCreate.zip_code(obj.zip_code).then( data => { 
        delete obj.zip_code
        obj.zip_id = data
      }),
      locateOrCreate.client_type(obj.client_type).then( data => { 
        delete obj.client_type
        dbPackage.client_type_id = data
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}


module.exports = router