'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  let jobMain = {}
  let mainClientId = null
  let propertyId = null
  let allClientIds = []
  let jobId

  return Promise.all([

    knex('Jobs')
      .select(
        'Jobs.job_id',
        'Jobs.job_number',
        'Jobs.job_status',
        'Jobs.start_date',
        'Jobs.complete_date',
        'Jobs.last_accessed',
        'Jobs.target_date'
      )
      .where('job_number', job_number)
      .then(data => {
        jobId = data[0].job_id
        jobMain.Job = data[0]
      }).catch(err => console.log('err', err)),

    knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name',
        'Client_Types.client_type'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .leftJoin('Client_Types', 'Client_Specs_Per_Job.client_type_id', 'Client_Types.client_type_id')
      .where('Jobs.job_number', job_number)
      .then(data => {
        if (data[0]) {
          allClientIds = data.map(client => client.client_id) 
        }
        jobMain.Clients = data
      }).catch(err => console.log('err', err)),


    knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name',
        'Clients.email',
        'Clients.home_phone',
        'Clients.mobile_phone',
        'Clients.notes',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip',
        'Counties.county',
        'Client_Types.client_type'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Client_Types', 'Client_Specs_Per_Job.client_type_id', 'Client_Types.client_type_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .leftJoin('Addresses', 'Clients.address_id', 'Addresses.address_id')      
      .leftJoin('Cities', 'Clients.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Clients.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')      
      .leftJoin('Counties', 'Clients.county_id', 'Counties.county_id')      
      .where('Jobs.job_number', job_number)
      .where('Client_Specs_Per_Job.main', true )
      .then(data => {
        if (data[0]) {
          mainClientId = data[0].client_id
        }
        jobMain.Main = data[0]
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
        'Zip_Codes.zip'
      )
      .join('Jobs_Properties', 'Properties.property_id', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', 'Jobs.job_id')
      .leftJoin('Counties', 'Properties.county_id', 'Counties.county_id')      
      .leftJoin('Cities', 'Properties.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Properties.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Properties.zip_id', 'Zip_Codes.zip_id')    
      .where('job_number', job_number)
      .then( data => {
        if (data[0]) {
          propertyId = data[0].property_id
        }
        jobMain.Property = data[0]
      }).catch(err => console.log('err', err)),

    knex('Estimates')
        .select(
          'Tasks.task',
          'Tasks.task_id',
          'Tasks.rate',
          'Tasks.hourly',
          'Estimates_Tasks.time_if_hourly',
          'Estimates_Tasks.rate_if_modified',
          'Estimates_Tasks.estimate_task_id'
        )
        .join('Jobs', 'Jobs.estimate_id', 'Estimates.estimate_id')
        .join('Estimates_Tasks', 'Estimates_Tasks.estimate_id', 'Estimates.estimate_id')
        .join('Tasks', 'Estimates_Tasks.task_id', 'Tasks.task_id')
        .where('job_number', job_number)
        .then(data => jobMain.EstimateDetails = data),

      knex('Invoices')
        .select(
          'Invoices.invoice_number',
          'Invoices.invoice_id',
          'Invoices.date_created',
          'Invoices.notes'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .where('job_number', job_number)
        .then(data => jobMain.Invoices = data[0]),

      knex('Invoices')
        .select(
          'Tasks.task',
          'Tasks.task_id',
          'Tasks.rate',
          'Tasks.hourly',
          'Invoices_Tasks.time_if_hourly',
          'Invoices_Tasks.rate_if_modified',
          'Invoices_Tasks.status',
          'Invoices_Tasks.target_date',
          'Invoices_Tasks.invoice_task_id'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .join('Invoices_Tasks', 'Invoices_Tasks.invoice_id', 'Invoices.invoice_id')
        .join('Tasks', 'Invoices_Tasks.task_id', 'Tasks.task_id')
        .where('job_number', job_number)
        .then(data => jobMain.InvoiceDetails = data),

      knex('Attachments')
        .select(
          'attachment_id',
          'file_name',
          'file_path'
        )
        .join('Jobs', 'Attachments.job_id', 'Jobs.job_id')
        .where('job_number', job_number)
        .then(data => jobMain.Attachments = data) 

  ]) 
  .then( () => {
    return Promise.all([

      knex('Jobs')
        .select('Job_Types.job_type')
        .join('Jobs_Job_Types', 'Jobs.job_id', 'Jobs_Job_Types.job_id')
        .join('Job_Types', 'Jobs_Job_Types.job_type_id', 'Job_Types.job_type_id')
        .where('Jobs.job_id', jobId)
        .then(data => jobMain.Job.job_types = data.map( type => type.job_type))
        .catch(err => console.log('err', err)),

      knex('Representatives')
        .select(
          'Clients.client_id',
          'Representatives.representative_id',
          'Representatives.first_name as First Name',
          'Representatives.middle_name as Middle Name',
          'Representatives.last_name as Last Name'
        )
        .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
        .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
        .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
        .where('Jobs.job_number', job_number)
        .whereIn('Clients.client_id', allClientIds)
        .then(data => jobMain.Representatives = data)
        .catch(err => console.log('err', err)),

      knex('Properties')
        .select(
          'Addresses.address',
          'Properties_Addresses.is_primary'
        )
        .join('Properties_Addresses', 'Properties.property_id', 'Properties_Addresses.property_id')
        .join('Addresses', 'Properties_Addresses.address_id', 'Addresses.address_id')
        .whereIn('Properties.property_id', propertyId)
        .then(data => {
          if(jobMain.Property) {
            jobMain.Property.addresses = data.map(query => {
              return {
                address: query.address,
                is_primary: query.is_primary
              }
            })
          }
        }).catch(err => console.log('err', err)),
   
      knex('Properties')
        .select('Roads.road')
        .join('Properties_Roads', 'Properties.property_id', 'Properties_Roads.property_id')
        .join('Roads', 'Properties_Roads.road_id', 'Roads.road_id')
        .whereIn('Properties.property_id', propertyId)
        .then(data => {
          if(jobMain.Property) {
            jobMain.Property.roads = data.map(road => road.road)
          }
        }).catch(err => console.log('err', err)),

      knex('Representatives')
        .select(
          'Clients.client_id',
          'Representatives.representative_id',
          'Representatives.first_name',
          'Representatives.middle_name',
          'Representatives.last_name',
          'Representatives.email',
          'Representatives.business_phone',
          'Representatives.mobile_phone',
          'Companies.company_name',
          'Addresses.address as company_address'
        )
        .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
        .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
        .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
        .leftJoin('Companies', 'Representatives.company_id', 'Companies.company_id')
        .leftJoin('Addresses', 'Companies.address_id', 'Addresses.address_id')
        .where('Jobs.job_number', job_number)
        .where('Clients.client_id', mainClientId)
        .then( data => {
          if (jobMain.Main) {
            jobMain.Main.Rep = data[0]
          }  
        })
        .catch(err => console.log('err', err))
    ])
    .then( () => res.send(jobMain))     
  })     
})

module.exports = router