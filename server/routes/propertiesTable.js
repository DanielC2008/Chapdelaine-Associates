'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const {validateProperty, validateAddress, validateRoad} = require('../validation/validProperty')

router.post('/api/validateProp', ({body: {dbObj}}, res) => {
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    res.send({msg: 'Valid Property!'})
  }
})

router.post('/api/validateAddress', ({body: {dbObj}}, res) => {
  const errors = validateAddress.validate(dbObj) 
  if (errors[0]) { 
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    res.send({msg: 'Valid Address!'})
  }
})

router.post('/api/validateRoad', ({body: {dbObj}}, res) => {
  const errors = validateRoad.validate(dbObj)
  if (errors[0]) { 
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    res.send({msg: 'Valid Road!'})
  }
})

router.get('/api/getAddressesForSearch', ({body}, res) => {
  knex('Addresses')
  .select(
    'address AS value',
    'address_id AS id'
  )
  .then( data => res.send(data))
  .catch( err => console.log(err))
})

router.get('/api/getRoadsForSearch', ({body}, res) => {
  knex('Roads')
  .select(
    'road AS value',
    'road_id AS id'
  )
  .then( data => res.send(data))
  .catch( err => console.log(err))
})


router.post('/api/addNewPropertyToJob', ({body: {dbObj}}, res) => {
  getConnectTableIds(dbObj).then( data => {
    let polishedObj = data.obj
    knex('Properties')
    .returning('property_id')
    .insert(polishedObj)
    .then( data => {
      let property_id = data[0]
      Promise.all([
        addAddress(polishedObj.primary_address_id, property_id),
        addRoad(polishedObj.primary_road_id, property_id),
      ]).then(() => res.send({property_id: property_id})).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }).catch( err => console.log(err))
})

router.post('/api/updateProperty', ({body: {dbObj, id}}, res) => {
  getConnectTableIds(dbObj).then( data => {
    let polishedObj = data.obj
    knex('Properties')
    .update(polishedObj)
    .then( data => {
      Promise.all([
        addAddress(polishedObj.primary_address_id, id),
        addRoad(polishedObj.primary_road_id, id),
      ]).then(() => res.send()).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }).catch( err => console.log(err))
})

router.post('/api/addSecondaryAddress', ({body: {address, property_id}}, res) => {
  locateOrCreate.address(address).then( data => { 
    let address_id = data
    addAddress(address_id, property_id).then( () => res.send()).catch(err => console.log(err))
  })
})

router.post('/api/removeSecondaryAddress', ({body: {address, property_id}}, res) => {
  knex('Addresses')
  .select('address_id')
  .where({address: address})
  .then( data => {
    let address_id = data[0].address_id
    knex('Properties_Addresses')
    .del()
    .where({address_id: address_id})
    .andWhere({property_id: property_id})
    .then( () => res.send())
    .catch( err => console.log('err', err))
  })
})

router.post('/api/addSecondaryRoad', ({body: {road, property_id}}, res) => {
  locateOrCreate.road(road).then( data => { 
    let road_id = data
    addRoad(road_id, property_id).then( () => res.send()).catch(err => console.log(err))
  })
})

router.post('/api/removeSecondaryRoad', ({body: {road, property_id}}, res) => {
  knex('Roads')
  .select('road_id')
  .where({road: road})
  .then( data => {
    let road_id = data[0].road_id
    knex('Properties_Roads')
    .del()
    .where({road_id: road_id})
    .andWhere({property_id: property_id})
    .then( () => res.send())
    .catch( err => console.log('err', err))
  })
})

//break these into two/////////////////////////////////////////////////////


//this function adds the property and address id to Properties_Address if this combo doesn't already exist
const addAddress = (address_id, property_id) => {
  return new Promise( (resolve, reject) => {
    //if address_id user submited address
    if (address_id) {
      knex('Properties_Addresses')
      .where({address_id: address_id})
      .andWhere({property_id: property_id})
      .then( exists => {
        //if these exist on Properties address. dont create again
        if (exists[0]) {
          resolve() 
        } else {
        //else create it
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

//this function adds the property and road id to Properties_Roads if this combo doesn't already exist
const addRoad = (road_id, property_id) => {
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
        if (obj.state) {
          obj.state_id = data
        }
        delete obj.state
      }),
      locateOrCreate.city(obj.city).then( data => { 
        if (obj.city) {
          obj.city_id = data
        }  
        delete obj.city
      }),
      locateOrCreate.county(obj.county).then( data => {
        if (obj.county) {
          obj.county_id = data
        }
        delete obj.county
      }),
      locateOrCreate.zip_code(obj.zip_code).then( data => { 
        if (obj.zip_code) {
          obj.zip_id = data
        }  
        delete obj.zip_code
      }),
      locateOrCreate.address(obj.primary_address).then( data => { 
        if (obj.primary_address) {
          obj.primary_address_id = data
        }
        delete obj.primary_address
      }),
      locateOrCreate.road(obj.primary_road).then( data => { 
        if (obj.primary_road) {
          obj.primary_road_id = data
        }  
        delete obj.primary_road
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}

module.exports = router