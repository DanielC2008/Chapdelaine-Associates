'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validEmployee = require('../validation/validEmployee')
const validationHelper = require('../validation/validationHelper')



router.post('/api/register', ({body}, res) => {
  knex('Users')
    .returning('user_name')
    .insert(body)
    .then( data => {
      res.send({user_name: data[0]})
    })
    .catch( err => {
      if (err.code === "EREQUEST") {
        res.send({msg: "User Name already exists. Please create another."})
      } else {
        res.send({msg: "An error has occured. Please try again."})
      }
    })
})

router.post('/api/login', ({body: {user_name, password}, session}, res) => {
  knex('Users')
    .where({user_name})
    .then( listedUsers => {
      let [user] = listedUsers
      if (password === user.password){
        session.user = user.user_name
        res.send({user_name: session.user})
      } else {
        res.send({msg: "User Name and/or password incorrect."})
      }
    })
    .catch( err => {
      console.log('err', err);
      res.send({msg: "An error has occured. Please try again."})
    })
})

router.get('/api/getUserName', ({session}, res) => res.send({user_name: session.user}))

router.get('/api/removeUser', ({session}, res) => {
  session.destroy()
  res.send()
})

router.get('/api/getAllEmployees', (req, res) => knex('Employees').then( data=> res.send(data)))

// router.post('/api/getFullRepById', ({body: {ids}}, res) => {
//   const representative_id = ids.representative_id
//   knex('Representatives')
//   .select(
//     'Representatives.representative_id',
//     'Representatives.first_name',
//     'Representatives.middle_name',
//     'Representatives.last_name',
//     'Representatives.email',
//     'Representatives.business_phone',
//     'Representatives.mobile_phone',
//     'Representatives.home_phone',
//     'Representatives.fax_number',
//     'Representatives.notes',
//     'Companies.company_name',
//     'Company_Address.address as company_address',
//     'Addresses.address',
//     'Cities.city',
//     'States.state',
//     'Zip_Codes.zip_code',
//     'Counties.county'
//   )
//   .leftJoin('Companies', 'Representatives.company_id', 'Companies.company_id')
//   .leftJoin('Addresses as Company_address', 'Companies.address_id', 'Company_address.address_id')
//   .leftJoin('Addresses', 'Representatives.address_id', 'Addresses.address_id')      
//   .leftJoin('Cities', 'Representatives.city_id', 'Cities.city_id') 
//   .leftJoin('States', 'Representatives.state_id', 'States.state_id')      
//   .leftJoin('Zip_Codes', 'Representatives.zip_id', 'Zip_Codes.zip_id')      
//   .leftJoin('Counties', 'Representatives.county_id', 'Counties.county_id')    
//   .where('Representatives.representative_id', representative_id)
//   .then(data => res.send(data[0]))
//   .catch(err => console.log('err', err))
// })

// router.post('/api/removeRepFromJob', ({body: {ids}}, res) => {
//   knex('Client_Specs_Per_Job')
//   .update('representative_id', null) //-----------------update to null so we keep client associated with job
//   .where(ids)
//   .then( data => {res.send({msg: 'Removed from Job!'})})
//   .catch( err => console.log(err))
// })

router.post('/api/addNewEmployee', ({body: {dbObj, ids}}, res) => {
  const errors = validEmployee.validate(dbObj, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    validationHelper.checkNameExists(dbObj, 'Employees').then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send(nameExists)
      } else {
        getConnectTableIds(dbObj).then( data => {
          let polishedObj = data.obj
          knex('Employees')
          .insert(polishedObj)
          .then( data => {
            res.send({msg: 'Successfully created Employee!'})
          }).catch( err => console.log(err))
        })  
      } 
    })   
  }
})

// router.post('/api/updateRep', ({body: {dbObj, ids}}, res) => {
//   const representative_id = {representative_id: ids.representative_id}
//   const errors = validateRep.validate(dbObj)
//   if (errors[0]) {  //------------------------------------checks each data type
//     let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
//     res.status(400).send(msg)
//   } else {
//     validationHelper.checkNameExistsOnEdit(representative_id, dbObj, 'Representatives')
//     .then( nameExists => {
//       if (nameExists) { //-----------------------------checks if name already exists in DB
//         res.status(400).send(nameExists)
//       } else {
//         getConnectTableIds(dbObj).then( data => {
//           let polishedObj = data.obj
//           knex('Representatives') //---------------------find client
//           .update(polishedObj)
//           .where(representative_id)
//           .then( () => res.send({msg: 'Successfully updated Job!'}))
//           .catch( err => console.log(err))        
//         })
//       }
//     })
//   }
// })


const getConnectTableIds = obj => {
  let dbPackage = {}
  return new Promise( (resolve, reject) => {
    Promise.all([  //-----------------get existing state, city, address, county, zip_code
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
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}
module.exports = router