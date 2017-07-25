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


router.post('/api/addNewPropertyToJob', ({body: {dbObj, ids}}, res) => {
  let job_id = ids.job_id
  let property_id
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      let address_id = data.obj.primary_address_id  ? data.obj.primary_address_id : null
      let road_id = data.obj.primary_road_id ? data.obj.primary_road_id : null
      knex('Properties') //------------------------make property
      .returning('property_id')
      .insert(polishedObj)
      .then( data => {
        property_id = data[0]
        return Promise.all([
          addAddress(address_id, property_id).then().catch( err => console.log('err', err)),
          addRoad(road_id, property_id).then().catch( err => console.log('err', err)),
        ]).then( () => {
          knex('Jobs')
          .update({property_id: property_id})
          .where({job_id: job_id})
          .then( () => res.send({msg: 'Successfully created and added to Job!'})).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

router.post('/api/updateProperty', ({body: {dbObj, ids}}, res) => {
  const property_id = ids.property_id
  const errors = validateProperty.validate(dbObj, {typecast: true}) //typcast allows me to force a datatype
  if (errors[0]) {  //------------------------------------checks each type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      let address_id = data.obj.primary_address_id  ? data.obj.primary_address_id : null
      let road_id = data.obj.primary_road_id ? data.obj.primary_road_id : null
      knex('Properties')
      .update(polishedObj)
      .where({property_id: property_id})
      .then( data => {
        return Promise.all([
          addAddress(address_id, property_id),
          addRoad(road_id, property_id)
        ]).then( () => res.send({msg: 'Successfully updated Job!'})).catch(err => console.log(err))
      }).catch( err => console.log(err))
    }).catch( err => console.log(err))
  }
})

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

router.post('/api/addSecondaryAddressOrRoad', ({body: {dbObj, ids}}, res) => {
  let property_id = ids.property_id
  getAddresssRoadIds(dbObj).then( data => {
    let road_id = data.obj.road_id
    let address_id = data.obj.address_id
    return Promise.all([
      addAddress(address_id, property_id),
      addRoad(road_id, property_id)
    ]).then( () => res.send({msg: 'Successfully updated Property!'})).catch(err => console.log(err))
  })
})

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

const getAddresssRoadIds = obj => {
  let dbPackage = {}
  return new Promise( (resolve, reject) => {
    Promise.all([ //------------------address and road
      locateOrCreate.address(obj.address).then( data => { 
        delete obj.address
        obj.address_id = data
      }),
      locateOrCreate.road(obj.road).then( data => { 
        delete obj.road
        obj.road_id = data
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}

module.exports = router