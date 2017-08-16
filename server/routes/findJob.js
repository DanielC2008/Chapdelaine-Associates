'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

router.post('/api/customerForeignKey', ({body: { objToFind }}, res) => {
  //what column are we quering
  let column = Object.keys(objToFind)[0]
  //retrieve variables required to join table of foreign key
  const {tableName, tableId} = DBHelper.getTableInfo(column)
  //get all customers with the parameter user requested
  knex('Customers')
  .select('Customers.customer_id')
  .join(`${tableName}`, `Customers.${tableId}`, `${tableName}.${tableId}`)
  .where(objToFind)
  .then( customers => {
    let customerArr = customers.map( customer => customer.customer_id)
    //find all jobs with those customers
    knex('Jobs')
    .select('job_number')
    .whereIn('client_id', customerArr)
    .orWhereIn('owner_id', customerArr)
    .orWhereIn('client_contact_id', customerArr)
    .orWhereIn('owner_contact_id', customerArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/customerRegColumn', ({body: { objToFind }}, res) => {
  //find column on customer table
  knex('Customers')
  .select('Customers.customer_id')
  .where(objToFind)
  .then( customers => {
    let customerArr = customers.map( customer => customer.customer_id)
    //find all jobs with those customers
    knex('Jobs')
    .select('job_number')
    .whereIn('client_id', customerArr)
    .orWhereIn('owner_id', customerArr)
    .orWhereIn('client_contact_id', customerArr)
    .orWhereIn('owner_contact_id', customerArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/propertyConnectTable', ({body: { objToFind }}, res) => {
  res.send({msg: 'pct'})
})

router.post('/api/propertyForeignKey', ({body: { objToFind }}, res) => {
  //what column are we quering
  let column = Object.keys(objToFind)[0]
  //retrieve variables required to join table of foreign key
  const {tableName, tableId} = DBHelper.getTableInfo(column)
  //get all propeties with the parameter user requested
  knex('Properties')
  .select('Properties.property_id')
  .join(`${tableName}`, `Properties.${tableId}`, `${tableName}.${tableId}`)
  .where(objToFind)
  .then( properties => {
    let propArr = properties.map( property => property.property_id)
    //find all jobs with those properties
    knex('Jobs')
    .select('job_number')
    .whereIn('property_id', propArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/propertyRegColumn', ({body: { objToFind }}, res) => {
  //find column on property table
  knex('Properties')
  .select('Properties.property_id')
  .where(objToFind)
  .then( properties => {
    let propArr = properties.map( property => property.property_id)
    //find all jobs with those properties
    knex('Jobs')
    .select('job_number')
    .whereIn('property_id', propArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/searchForJobStatus', ({body: { objToFind }}, res) => {
  res.send({msg: 'sjs'})
})

router.post('/api/searchForTasks', ({body: { objToFind }}, res) => {
  res.send({msg: 'sft'})
})












router.post('/api/findJob', ({body}, res) => {

  let paramsArr = body

  const querySort = (param, cb) => {
    let objToFind = param.objToFind
    let column = Object.keys(objToFind)
    // console.log('objToFind', objToFind)
    // console.log('column', column)

    // let {tableName, returningId, findJobId} = DBHelper.getTableInfo(param.table)

    //if param in [array of params on another table with connect table]
    //example find all jobs with a particular address
    knex('Customers')
    .select('Customers.customer_id')
    .join('Addresses', 'Customers.address_id', 'Addresses.address_id')
    .where(objToFind)
    .then( data => {
      let customerArr = data.map( customer => customer.customer_id)
      // console.log('customerArr', customerArr) 
      knex('Jobs')
      .select('job_number')
      .whereIn('client_id', customerArr)
      .orWhereIn('owner_id', customerArr)
      .orWhereIn('client_contact_id', customerArr)
      .orWhereIn('owner_contact_id', customerArr)
      .then( data => console.log('data', data))

      // res.send(data)
    })

//CREATE FOR PROPS, JOBS AND TASKS

    //else if in [array of params on another table]
    
    //else param is on table





    // if (param.table != 'Jobs') {
    //   let {tableName, connectTable, returningId, findJobId} = DBHelper.getTableInfo(param.table)
    //   knex(`${tableName}`)
    //     .select('Jobs.job_number', `${tableName}.${column}` )
    //     .join(`${connectTable}`, `${connectTable}.${returningId}`, `${tableName}.${returningId}`)
    //     .join('Jobs', `Jobs.${findJobId}`, `${connectTable}.${findJobId}`)
    //     .where(objToFind)
    //     .then( data => cb(data))
    // }
     // else {
    //   if (Object.keys(objToFind)[0] == 'invoice_number') {
    //     knex('Invoices')
    //       .select('Jobs.job_number', `${tableName}.${column}` )
    //       .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
    //       .where(objToFind)
    //       .then( data => cb(data)) 
    //   } else {
    //     knex('Jobs')
    //       .select('Jobs.job_number', `${tableName}.${column}` )
    //       .where(objToFind)
    //       .then( data => cb(data))
    //   }
    // }
  }

  let matches = paramsArr.map( param => {
    return new Promise((resolve) => {
      querySort(param, resolve)
    })
  })
  
  Promise.all(matches).then( data => data[0].length === 0 ? res.sendStatus(400) : res.send(data))  

})

module.exports = router