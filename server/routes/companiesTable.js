'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validCompany = require('../validation/validCompany')
const validationHelper = require('../validation/validationHelper') 
const sqlErrors = require('../errorHandling/sqlErrors')

router.post('/api/validateCompany', ({body: {dbObj, customer_id}}, res) => {
  const errors = validCompany.validate(dbObj)
  if (errors[0]) {
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    res.send({msg: 'Valid Company!'})
  }
})

router.get('/api/getCompaniesForSearch', (req, res) => {
  knex('Companies')
  .select(
    'company_name AS value',
    'company_id AS id'
  )
  .then( data => res.send(data))
  .catch( err => console.log(err))
}) 

router.post('/api/getFullCompanyById', ({body: {company_id}}, res) => {
  knex('Companies')
  .select(
    'Companies.company_id',
    'Companies.company_name',
    'Addresses.address AS company_address'
  )
  .leftJoin('Addresses', 'Companies.address_id', 'Addresses.address_id')           
  .where('Companies.company_id', company_id)
  .then(data => res.send(data[0]))
  .catch(err => console.log('err', err))
})

router.post('/api/updateCompany', ({body: {dbObj, ids}}, res) => {
  getConnectTableIds(dbObj).then( data => {
    let polishedObj = data.obj
    knex('Companies')
    .update(polishedObj)
    .where({company_id: ids.company_id})
    .then( () => res.send({msg: 'Successfully updated Company!'}))
    .catch( err => console.log('err', err))
  })
})

router.post('/api/addNewCompany', ({body: {dbObj}}, res) => {
  const errors = validCompany.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {  
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      knex('Companies')
      .insert(polishedObj)
      .then( () => res.send({msg: 'Successfully added new Company!'}))
      .catch( err => {
        let error = sqlErrors(err.number)
        res.status(400).send({msg: error})
      })
    })
  }
})

const getConnectTableIds = obj => {
  let dbPackage = {}
  return new Promise( (resolve, reject) => {
    Promise.all([ //------------------address
      locateOrCreate.address(obj.company_address).then( data => { 
        delete obj.company_address
        obj.address_id = data
      })
    ])
    .then( () => {
      dbPackage.obj = obj
      resolve(dbPackage)
    })
  })
}


module.exports = router