'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  let job = {}
  // let mainClientId = null
  // let propertyId = null
  // let allClientIds = []
  // let jobId

  return Promise.all([

    knex('Jobs')
      .select(
        'Jobs.job_id',
        'Jobs.job_number',
        'Job_Statuses.job_status',
        'Jobs.on_hold',
        'Jobs.start_date',
        'Jobs.complete_date',
        'Jobs.last_accessed',
        'Jobs.target_date'
      )
      .leftJoin('Job_Statuses', 'Jobs.job_status_id', 'Job_Statuses.job_status_id')
      .where('Jobs.job_number', job_number)
      .then(data => {
        // jobId = data[0].job_id
        job.job_Info = data[0]
      }).catch(err => console.log('err', err)),

    knex('Jobs') 
      .select(
        'Customers.customer_id',
        'Customers.first_name',
        'Customers.middle_name',
        'Customers.last_name',
        'Customers.email',
        'Customers.home_phone',
        'Customers.mobile_phone',
        'Customers.notes',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip_code',
        'Counties.county',
        'Client_Types.client_type'
        // 'Companies.company_name',
        // 'Addresses.address as company_address'
      )
      .join('Customers', 'Jobs.client_id',  'Customers.customer_id')
      .join('Client_Types', 'Jobs.client_type_id', 'Client_Types.client_type_id')
      // .leftJoin('Companies', 'Customers.company_id', 'Companies.company_id')
      .leftJoin('Addresses', 'Customers.address_id', 'Addresses.address_id')      
      .leftJoin('Cities', 'Customers.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Customers.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Customers.zip_id', 'Zip_Codes.zip_id')      
      .leftJoin('Counties', 'Customers.county_id', 'Counties.county_id')      
      .where('Jobs.job_number', job_number)
      .then(data => {
        // if (data[0]) {
        //   mainClientId = data[0].client_id
        // }
        job.client = data[0]
      }).catch(err => console.log('err', err)),

    knex('Jobs') 
      .select(
        'Customers.customer_id',
        'Customers.first_name',
        'Customers.middle_name',
        'Customers.last_name',
        'Customers.email',
        'Customers.home_phone',
        'Customers.mobile_phone',
        'Customers.notes',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip_code',
        'Counties.county'
        // 'Companies.company_name',
        // 'Addresses.address as company_address'
      )
      .join('Customers', 'Jobs.client_contact_id', 'Customers.customer_id')
      .leftJoin('Addresses', 'Customers.address_id', 'Addresses.address_id')      
      .leftJoin('Cities', 'Customers.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Customers.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Customers.zip_id', 'Zip_Codes.zip_id')      
      .leftJoin('Counties', 'Customers.county_id', 'Counties.county_id')      
      .where('Jobs.job_number', job_number)
      .then(data => {
        job.client_contact = data[0]
      }).catch(err => console.log('err', err)),

    knex('Jobs') 
      .select(
        'Customers.customer_id',
        'Customers.first_name',
        'Customers.middle_name',
        'Customers.last_name'
      )
      .join('Customers', 'Jobs.owner_id', 'Customers.customer_id')
      .where('Jobs.job_number', job_number)
      .then(data => {
        job.owner = data[0]
      }).catch(err => console.log('err', err)),

    knex('Jobs') 
      .select(
        'Customers.customer_id',
        'Customers.first_name',
        'Customers.middle_name',
        'Customers.last_name'
      )
      .join('Customers', 'Jobs.owner_contact_id', 'Customers.customer_id')
      .where('Jobs.job_number', job_number)
      .then(data => {
        job.owner_contact = data[0]
      }).catch(err => console.log('err', err)),

    knex('Properties')
      .select(
        'Properties.property_id',
        'Properties.property_map', 
        'Properties.parcel_number',
        'Properties.plat_book',
        'Properties.plat_page',
        'Properties.deed_book',
        'Properties.deed_page',
        'Properties.sub_division',
        'Properties.lot_number',
        'Properties.notes',
        'Properties.acres',
        'Counties.county',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip_code',
        'Addresses.address as primary_address',
        'Roads.road as primary_road'
      )
      .join('Jobs', 'Jobs.property_id', 'Properties.property_id')
      .leftJoin('Counties', 'Properties.county_id', 'Counties.county_id')      
      .leftJoin('Cities', 'Properties.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Properties.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Properties.zip_id', 'Zip_Codes.zip_id')    
      .leftJoin('Addresses', 'Properties.primary_address_id', 'Addresses.address_id')    
      .leftJoin('Roads', 'Properties.primary_road_id', 'Roads.road_id')    
      .where('job_number', job_number)
      .then( data => {
        // if (data[0]) {
        //   propertyId = data[0].property_id
        // }
        job.property = data[0]
      }).catch(err => console.log('err', err))

    // knex('Estimates')
    //     .select(
    //       'Tasks.task',
    //       'Tasks.task_id',
    //       'Tasks.rate',
    //       'Tasks.hourly',
    //       'Estimates_Tasks.time_if_hourly',
    //       'Estimates_Tasks.rate_if_modified',
    //       'Estimates_Tasks.estimate_task_id'
    //     )
    //     .join('Jobs', 'Jobs.estimate_id', 'Estimates.estimate_id')
    //     .join('Estimates_Tasks', 'Estimates_Tasks.estimate_id', 'Estimates.estimate_id')
    //     .join('Tasks', 'Estimates_Tasks.task_id', 'Tasks.task_id')
    //     .where('job_number', job_number)
    //     .then(data => jobMain.EstimateDetails = data),

    //   knex('Invoices')
    //     .select(
    //       'Invoices.invoice_number',
    //       'Invoices.invoice_id',
    //       'Invoices.date_created',
    //       'Invoices.notes'
    //     )
    //     .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
    //     .where('job_number', job_number)
    //     .then(data => jobMain.Invoices = data[0]),

    //   knex('Invoices')
    //     .select(
    //       'Tasks.task',
    //       'Tasks.task_id',
    //       'Tasks.rate',
    //       'Tasks.hourly',
    //       'Invoices_Tasks.time_if_hourly',
    //       'Invoices_Tasks.rate_if_modified',
    //       'Invoices_Tasks.status',
    //       'Invoices_Tasks.target_date',
    //       'Invoices_Tasks.invoice_task_id'
    //     )
    //     .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
    //     .join('Invoices_Tasks', 'Invoices_Tasks.invoice_id', 'Invoices.invoice_id')
    //     .join('Tasks', 'Invoices_Tasks.task_id', 'Tasks.task_id')
    //     .where('job_number', job_number)
    //     .then(data => jobMain.InvoiceDetails = data),

    //   knex('Attachments')
    //     .select(
    //       'attachment_id',
    //       'file_name',
    //       'file_path'
    //     )
    //     .join('Jobs', 'Attachments.job_id', 'Jobs.job_id')
    //     .where('job_number', job_number)
    //     .then(data => jobMain.Attachments = data) 

  ]) 
  .then( () => {
    // return Promise.all([

    //   knex('Jobs') ///////////////////////////////move up ^
    //     .select('Job_Types.job_type')
    //     .join('Jobs_Job_Types', 'Jobs.job_id', 'Jobs_Job_Types.job_id')
    //     .join('Job_Types', 'Jobs_Job_Types.job_type_id', 'Job_Types.job_type_id')
    //     .where('Jobs.job_id', jobId)
    //     .then(data => jobMain.Job.job_types = data.map( type => type.job_type))
    //     .catch(err => console.log('err', err)),

    //   knex('Representatives')
    //     .select(
    //       'Clients.client_id',
    //       'Representatives.representative_id',
    //       'Representatives.first_name',
    //       'Representatives.middle_name',
    //       'Representatives.last_name'
    //     )
    //     .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
    //     .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
    //     .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
    //     .where('Jobs.job_number', job_number)
    //     .whereIn('Clients.client_id', allClientIds)
    //     .then(data => jobMain.Representatives = data)
    //     .catch(err => console.log('err', err)),

    //   knex('Representatives')
    //     .select(
    //       'Clients.client_id',
    //       'Representatives.representative_id',
    //       'Representatives.first_name',
    //       'Representatives.middle_name',
    //       'Representatives.last_name',
    //       'Representatives.email',
    //       'Representatives.business_phone',
    //       'Representatives.mobile_phone',
    //       'Companies.company_name',
    //       'Addresses.address as company_address'
    //     )
    //     .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
    //     .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
    //     .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
    //     .leftJoin('Companies', 'Representatives.company_id', 'Companies.company_id')
    //     .leftJoin('Addresses', 'Companies.address_id', 'Addresses.address_id')
    //     .where('Jobs.job_number', job_number)
    //     .where('Clients.client_id', mainClientId)
    //     .then( data => {
    //       if (jobMain.Main) {
    //         jobMain.Main.Rep = data[0]
    //       }  
    //     })
    //     .catch(err => console.log('err', err))
    // ])
    // .then( () => {
    res.send(job)
    // })     
  })     
})

module.exports = router