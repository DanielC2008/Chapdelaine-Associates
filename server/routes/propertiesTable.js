'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateProperty = require('../validation/validProperty')

router.post('/api/addNewPropertyToJob', ({body: {dbObj, ids}}, res) => {
  const job_id = ids.job_id
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      let address_id = data.obj.primary_address_id  ? data.obj.primary_address_id : null
      let road_id = data.obj.primary_road_id ? data.obj.primary_road_id : null
      knex('Properties') //------------------------make property
      .returning('property_id')
      .insert(polishedObj)
      .then( data => {
        let property_id = data[0]
        if (address_id) { //-----------------set ids on connecting tables if address
          new Promise( () => { 
            knex('Properties_Addresses') 
            .insert({
              address_id,
              property_id
            }).then().catch(err => console.log(err))
          }).then().catch( err => console.log(err))
        }
        if (road_id) { //-----------------set ids on connecting tables if road
          new Promise( () => {
            knex('Properties_Roads')
            .insert({
              road_id,
              property_id
            }).then().catch(err => console.log(err))
          }).then().catch(err => console.log(err))
        } 
        knex('Jobs_Properties') //----------------- always set ids on connecting tables
        .insert({
          job_id,
          property_id
        })
        .then( data => res.send({msg: 'Successfully created and added to Job!'}))
        .catch( err => console.log(err))
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

router.post('/api/updateProperty', ({body: {dbObj, ids}}, res) => {
  const job_id = ids.job_id
  const property_id = ids.property_id
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      let address_id = data.obj.primary_address_id  ? data.obj.primary_address_id : null
      let road_id = data.obj.primary_road_id ? data.obj.primary_road_id : null
      knex('Properties') //------------------------make property
      .update(polishedObj)
      .then( data => {
        if (address_id) { //-----------------set ids on connecting tables if address
          new Promise( () => { 
            knex('Properties_Addresses') 
            .insert({
              address_id,
              property_id
            }).then().catch(err => console.log(err))
          }).then().catch( err => console.log(err))
        }
        if (road_id) { //-----------------set ids on connecting tables if road
          new Promise( () => {
            knex('Properties_Roads')
            .insert({
              road_id,
              property_id
            }).then().catch(err => console.log(err))
          }).then().catch(err => console.log(err))
        } 
        res.send({msg: 'Successfully updated Job!'})
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

const getConnectTableIds = obj => {
  let dbPackage = {}
  return new Promise( (resolve, reject) => {
    Promise.all([ //------------------get existing state, city, address, county, zip_code, and road
      locateOrCreate.state(obj.state).then( data => {
        delete obj.state
        obj.state_id = data
      }),
      locateOrCreate.city(obj.city).then( data => { 
        delete obj.city
        obj.city_id = data
      }),
      locateOrCreate.county(obj.county).then( data => { 
        delete obj.county
        obj.county_id = data
      }),
      locateOrCreate.zip_code(obj.zip_code).then( data => { 
        delete obj.zip_code
        obj.zip_id = data
      }),
      locateOrCreate.address(obj.primary_address).then( data => { 
        delete obj.primary_address
        obj.primary_address_id = data
      }),
      locateOrCreate.road(obj.primary_road).then( data => { 
        delete obj.primary_road
        obj.primary_road_id = data
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}

module.exports = router