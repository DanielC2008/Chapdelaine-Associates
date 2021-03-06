'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validEmployee = require('../validation/validEmployee')
const validationHelper = require('../validation/validationHelper')



router.post('/api/validateEmployee', ({body: {dbObj, ids}}, res) => {
  const employee_id = {employee_id: ids.employee_id}
  const errors = validEmployee.validate(dbObj, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    validationHelper.checkNameExists(dbObj, 'Employees', employee_id).then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send({msg: `${nameExists}`})
      } else {
        res.send({msg: 'Valid Employee!'}) 
      } 
    })   
  }
})
  
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

router.get('/api/getUserName', ({session}, res) => {
  res.send({user_name: session.user})
})

router.get('/api/removeUser', ({session}, res) => {
  session.destroy()
  res.send()
})

router.get('/api/getAllEmployees', (req, res) => {
  knex('Employees')
  .select(
    'Employees.employee_id',
    'Employees.first_name',
    'Employees.middle_name',
    'Employees.last_name',
    'Employees.mobile_phone',
    'Employees.home_phone',
    'Employees.s_s_number',
    'Employees.date_of_birth',
    'Employees.marital_status',
    'Employees.u_s_citizen',
    'Employees.start_date',
    'Employees.end_date',
    'Employees.position',
    'Employees.pay_rate',
    'Addresses.address',
    'Cities.city',
    'States.state',
    'Zip_Codes.zip_code',
    'Counties.county'
  )
  .leftJoin('Addresses', 'Employees.address_id', 'Addresses.address_id')      
  .leftJoin('Cities', 'Employees.city_id', 'Cities.city_id') 
  .leftJoin('States', 'Employees.state_id', 'States.state_id')      
  .leftJoin('Zip_Codes', 'Employees.zip_id', 'Zip_Codes.zip_id')      
  .leftJoin('Counties', 'Employees.county_id', 'Counties.county_id') 
  .then( data=> res.send(data))
  .catch( err => console.log(err))
})

router.post('/api/deleteEmployee', ({body: {id}}, res) => {
  knex('Employees')
  .del() 
  .where({employee_id: id})
  .then( data => {res.send({msg: 'Employee Removed!'})})
  .catch( err => console.log(err))
})

router.post('/api/addNewEmployee', ({body: {dbObj}}, res) => {
  getConnectTableIds(dbObj).then( data => {
    let polishedObj = data.obj
    knex('Employees')
    .insert(polishedObj)
    .then( data => {
      res.send({msg: 'Successfully created Employee!'})
    }).catch( err => console.log(err))
  })  
})

router.post('/api/updateEmployee', ({body: {dbObj, ids}}, res) => {
  const employee_id = {employee_id: ids.employee_id}
  getConnectTableIds(dbObj).then( data => {
    let polishedObj = data.obj
    knex('Employees')
    .update(polishedObj)
    .where(employee_id)
    .then( data => {
      res.send({msg: 'Successfully updated Employee!'})
    }).catch( err => console.log(err))
  })  
})

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