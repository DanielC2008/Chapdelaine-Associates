'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateProperty = require('../validation/validProperty')

router.post('/api/getAddressesOnProp', ({body:{ property_id }}, res) => {
  knex('Properties')
  .select('Addresses.address')
  .join('Properties_Addresses', 'Properties.property_id', 'Properties_Addresses.property_id')
  .join('Addresses', 'Properties_Addresses.address_id', 'Addresses.address_id')
  .whereIn('Properties.property_id', property_id)
  .then( data => res.send(data))
  .catch(err => console.log('err', err))
})

router.post('/api/getRoadsOnProp', ({body:{ property_id }}, res) => {
  knex('Properties')
  .select('Roads.road')
  .join('Properties_Roads', 'Properties.property_id', 'Properties_Roads.property_id')
  .join('Roads', 'Properties_Roads.road_id', 'Roads.road_id')
  .whereIn('Properties.property_id', property_id)
  .then(data => res.send(data))
  .catch(err => console.log('err', err))
})

router.post('/api/addNewPropertyToJob', ({body: {dbObj, ids}}, res) => {
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      polishedObj.job_id = ids.job_id
      let address_id = data.obj.primary_address_id  ? data.obj.primary_address_id : null
      let road_id = data.obj.primary_road_id ? data.obj.primary_road_id : null
      knex('Properties') //------------------------make property
      .returning('property_id')
      .insert(polishedObj)
      .then( data => {
        let property_id = data[0]
        return Promise.all([
          addAddress(address_id).then().catch( err => console.log('err', err)),
          addRoad(road_id).then().catch( err => console.log('err', err)),
        ]).then( () => res.send({msg: 'Successfully created and added to Job!'})).catch(err => console.log(err))
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

router.post('/api/updateProperty', ({body: {dbObj, ids}}, res) => {
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
      knex('Properties')
      .update(polishedObj)
      .then( data => {
        return Promise.all([
          updateAddress(address_id, property_id),
          updateRoad(road_id, property_id)
        ]).then( () => res.send({msg: 'Successfully updated Job!'})).catch(err => console.log(err))
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

const addAddress = address_id => {
  return new Promise( (resolve, reject) => {
    if (address_id) {
      knex('Properties_Addresses') 
      .insert({
        address_id,
        property_id
      })
      .then(resolve()).catch(err => console.log(err))
    } else {resolve()}
  })
}

const addRoad = road_id => {
  return new Promise( (resolve, reject) => {
    if (road_id) {
      knex('Properties_Roads')
      .insert({
        road_id,
        property_id
      })
      .then().catch(err => console.log(err))
    } else {resolve()}
  })
}

const updateAddress = (address_id, property_id) => {
  return new Promise( (resolve, reject) => {
    if (address_id) {
      knex('Properties_Addresses')
      .where({address_id: address_id})
      .andWhere({property_id: property_id})
      .then( exists => {
        if (exists[0]) { 
          resolve() 
        } else {
          knex('Properties_Addresses') 
          .insert({
            address_id,
            property_id
          })
          .then(resolve()).catch(err => console.log(err)) 
        }
      }) 
    } else {resolve()}
  })
}

const updateRoad = (road_id, property_id) => {
  return new Promise( (resolve, reject) => {
    if (road_id) {
      knex('Properties_Roads')
      .where({road_id: road_id})
      .andWhere({property_id: property_id})
      .then( exists => {
        if (exists[0]) { 
          resolve() 
        } else {
          knex('Properties_Roads') 
          .insert({
            road_id,
            property_id
          })
          .then(resolve()).catch(err => console.log(err)) 
        }
      }) 
    } else {resolve()}
  })  
}

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