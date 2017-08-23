'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const DBHelper = require('../DBHelper')

const jobInfo = [
  'Jobs.job_number',
  'Jobs.on_hold',
  'Jobs.start_date',
  'Jobs.complete_date',
  'Jobs.last_accessed',
  'Jobs.target_date',
  'Job_Statuses.job_status',
  'Job_Types.job_type'
]  

router.post('/api/customerForeignKey', ({body: { objToFind }}, res) => {
  //what column are we quering
  const column = Object.keys(objToFind)[0]
  //retrieve variables required to join table of foreign key
  const {tableName, tableId} = DBHelper.getTableInfo(column)
  //get all customers with the parameter user requested
  knex('Customers')
  .select('Customers.customer_id')
  .join(`${tableName}`, `Customers.${tableId}`, `${tableName}.${tableId}`)
  .where(objToFind)
  .then( customers => {
    const customerArr = customers.map( customer => customer.customer_id)
    //find all jobs with those customers
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
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
    const customerArr = customers.map( customer => customer.customer_id)
    //find all jobs with those customers
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
    .whereIn('client_id', customerArr)
    .orWhereIn('owner_id', customerArr)
    .orWhereIn('client_contact_id', customerArr)
    .orWhereIn('owner_contact_id', customerArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/customerName', ({body: { objToFind }}, res) => {
  //find column on customer table
  knex('Customers')
  .select('Customers.customer_id')
  .where(objToFind)
  .then( customers => {
    const customerArr = customers.map( customer => customer.customer_id)
    //find all jobs with those customers
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
    .whereIn('client_id', customerArr)
    .orWhereIn('owner_id', customerArr)
    .orWhereIn('client_contact_id', customerArr)
    .orWhereIn('owner_contact_id', customerArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/propertyConnectTable', ({body: { objToFind }}, res) => {
  //what column are we quering
  const column = Object.keys(objToFind)[0]
  //retrieve variables required to join table of foreign key
  const {tableName, connectTable, tableId} = DBHelper.getTableInfo(column)
  //get ids of parameter user requested
  knex(`${tableName}`)
  .select(`${tableId}`)
  .where(objToFind)
  .then( data => {
    const id = data[0][`${tableId}`]
    //get all propeties with the id returned
    knex(`${tableName}`)
    .select('Properties.property_id')
    .join(`${connectTable}`,`${tableName}.${tableId}`, `${connectTable}.${tableId}`)
    .join('Properties', `${connectTable}.property_id`, 'Properties.property_id')
    .where(`${tableName}.${tableId}`, id)
    .then( properties => {
      const propArr = properties.map( property => property.property_id)
      //find all jobs with those properties
      knex('Jobs')
      .column(jobInfo)
      .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
      .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
      .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
      .whereIn('property_id', propArr)
      .then( data => res.send(data)).catch(err => console.log('err', err))
    })
  })
})

router.post('/api/propertyForeignKey', ({body: { objToFind }}, res) => {
  //what column are we quering
  const column = Object.keys(objToFind)[0]
  //retrieve variables required to join table of foreign key
  const {tableName, tableId} = DBHelper.getTableInfo(column)
  //get all propeties with the parameter user requested
  knex('Properties')
  .select('Properties.property_id')
  .join(`${tableName}`, `Properties.${tableId}`, `${tableName}.${tableId}`)
  .where(objToFind)
  .then( properties => {
    const propArr = properties.map( property => property.property_id)
    //find all jobs with those properties
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
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
    const propArr = properties.map( property => property.property_id)
    //find all jobs with those properties
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
    .whereIn('property_id', propArr)
    .then( data => res.send(data)).catch(err => console.log('err', err))
  })
})

router.post('/api/searchForJobStatus', ({body: { objToFind }}, res) => {
  if (objToFind.job_status === 'Hold'){
    knex('Jobs')
    .select('job_number')
    .where({on_hold: true})
    .then( data => {
      res.send(data)
    }).catch( err => console.log('err', err))   
  } else {
    knex('Jobs')
    .column(jobInfo)
    .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
    .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
    .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
    .where(objToFind)
    .then( data => res.send(data)).catch( err => console.log('err', err))
  }
})

router.post('/api/searchForJobType', ({body: { objToFind }}, res) => {
  knex('Job_Types')
  .column(jobInfo)
  .join('Jobs_Job_Types', 'Jobs_Job_Types.job_type_id', 'Job_Types.job_type_id')
  .join('Jobs', 'Jobs.job_id', 'Jobs_Job_Types.job_id')
  .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
  .where(objToFind)
  .then( data => res.send(data)).catch(err => console.log('err', err))
})

router.post('/api/searchForTasks', ({body: { objToFind }}, res) => {
  knex('Tasks')
  .column(jobInfo)
  .join('Invoices_Tasks', 'Invoices_Tasks.task_id', 'Tasks.task_id')
  .join('Jobs', 'Jobs.invoice_id', 'Invoices_Tasks.invoice_id')
  .join('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
  .join('Jobs_Job_Types', 'Jobs_Job_Types.job_id', 'Jobs.job_id')
  .join('Job_Types', 'Job_Types.job_type_id', 'Jobs_Job_Types.job_type_id')
  .where(objToFind)
  .then( data => res.send(data)).catch(err => console.log('err', err))
})

module.exports = router