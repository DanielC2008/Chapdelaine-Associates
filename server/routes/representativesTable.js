'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateRepresentative = require('../validation/validRepresentative')
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

router.post('/api/removeRepFromJob', ({body: {objToRemove}}, res) => {
  knex('Client_Specs_Per_Job')
    .update('representative_id', null) //-----------------update to null so we keep client associated with job
    .where(objToRemove)
    .then( data => {res.send({msg: 'Removed from Job!'})})
    .catch( err => console.log(err))
})

router.post('/api/addExistingRepToJob', ({body: {objToAdd: {representative_id, job_id, client_id}}}, res) => {
  knex('Client_Specs_Per_Job')  
      .update({ representative_id }) //----------------this update means that there can only be one rep per client per job
      .where({
        job_id,
        client_id
      }) 
    .then( () => res.send({msg: 'Successfully added to Job!'}))
    .catch( err => console.log(err))
})

router.post('/api/addNewRepToJob', ({body: {objToAdd, job_id, client_id}}, res) => {
  
  validationHelper.checkNameExists(objToAdd, 'Representatives').then( nameExists => {

    const errors = validateRepresentative.validate(objToAdd) 

    if (errors[0]) {  //------------------------------------checks each type
      let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
      res.status(400).send(msg)
      return
    } else if (nameExists) { //-----------------------------checks if name already exists in DB
      res.status(400).send('It appears this name already exists')
      return
    } else {
      return Promise.all([  //-----------------get existing state, city, address, county, zip
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
        locateOrCreate.company_name(objToAdd.company_name, objToAdd.company_address).then( data => { 
          delete objToAdd.company_name
          delete objToAdd.company_address
          objToAdd.company_id = data
        })
      ])
      .then( () => {
        knex('Representatives')     //--------------make rep
        .returning('representative_id')
        .insert(objToAdd)
        .then( data => {
          let representative_id = data[0]
          knex('Client_Specs_Per_Job')  //-------set ids on connecting table
          .update({ representative_id })   //-------this update means that there can only be one rep per client per job  
          .where({
            job_id,
            client_id
          }) 
          .then( data => res.send({msg: 'Successfully created and added to Job!'}))
          .catch( err => console.log(err))
        }).catch( err => console.log(err))
      })
    }  
  })
})


module.exports = router