'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
// const { validClient, validClientOnJob } = require('../validation/validClient')
// const validationHelper = require('../validation/validationHelper') 


router.get('/api/getCompaniesForSearch', (req, res) => {
  knex('Companies')
  .select(
    'company_name AS value',
    'company_id AS id'
  )
  .then( data => res.send(data))
  .catch( err => console.log(err))
}) 

router.post('/api/getFullCompanyById', ({body: {ids}}, res) => {
  const company_id = ids.company_id
  knex('Companies')
  .select(
    'Companies.company_id',
    'Companies.company_name',
    'Addresses.address AS company_address'
  )
  .leftJoin('Addresses', 'Companies.address_id', 'Addresses.address_id')           
  .where({'Companies.company_id': company_id})
  .then(data => res.send(data[0]))
  .catch(err => console.log('err', err))
})

router.post('/api/updateCompany', ({body: {dbObj, ids}}, res) => {
  // const errors = validTask.validate(task, {typecast: true})
  // if (errors[0]) {  //------------------------------------checks each data type
  //   let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
  //   res.status(400).send(msg)
  // } else {  
    getConnectTableIds(dbObj).then( data => {
      let polishedObj = data.obj
      knex('Companies')
      .update(polishedObj)
      .where({company_id: ids.company_id})
      .then( () => res.send({msg: 'Successfully updated Company!'}))
      .catch( err => console.log('err', err))
    })
  // }
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