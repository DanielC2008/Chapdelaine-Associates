'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  
  let Job = {}
  let clientID
  let propertyID
  let jobID

  return Promise.all([

    knex('Jobs')
      .select(
        'job_id',
        'job_number as Job Number',
        'job_status as Job Status',
        'start_date as Date Started',
        'complete_date as Date Completed',
        'last_accessed as Last Accessed',
        'target_date as Target Date'
      )
      .where('job_number', job_number)
      .then(data => {
        jobID = data[0].job_id
        Job.Jobs = data[0]
      }),

    knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name as First Name',
        'Clients.middle_name as Middle Name',
        'Clients.last_name as Last Name',
        'Clients.email as Email',
        'Clients.business_phone as Business Phone',
        'Clients.mobile_phone as Mobile Phone'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .where('Jobs.job_number', job_number)
      .then(data => {
        clientID = data.map(client => client.client_id)
        Job.Clients = data
      }),

    knex('Properties')
      .select(
        'Properties.property_id',
        'Properties.map as Map',
        'Properties.parcel_number as Parcel Number',
        'Properties.plat_book as Plat Book',
        'Properties.plat_page as Plat Page',
        'Properties.deed_book as Deed Book',
        'Properties.deed_page as Deed Page',
        'Properties.sub_division as Sub Division',
        'Properties.notes as Notes',
        'Properties.acres as Acres'
      )
      .join('Jobs_Properties', 'Properties.property_id', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', 'Jobs.job_id')  
      .where('job_number', job_number)
      .then(data => {
        propertyID = data.map(property => property.property_id)
        Job.Properties = data
      }),

      knex('Estimates')
        .select(
          'Estimates.estimate_id',
          'Estimates.date_created',
          'Estimates.notes'
        )
        .join('Jobs', 'Jobs.estimate_id', 'Estimates.estimate_id')
        .where('job_number', job_number)
        .then(data => Job.Estimates = data[0]),

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
        .then(data => Job.EstimateDetails = data),

      knex('Invoices')
        .select(
          'Invoices.invoice_number',
          'Invoices.invoice_id',
          'Invoices.date_created',
          'Invoices.notes'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .where('job_number', job_number)
        .then(data => Job.Invoices = data[0]),

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
        .then(data => Job.InvoiceDetails = data),

      knex('Attachments')
        .select(
          'attachment_id',
          'file_name',
          'file_path'
        )
        .join('Jobs', 'Attachments.job_id', 'Jobs.job_id')
        .where('job_number', job_number)
        .then(data => Job.Attachments = data) 

  ]).then( () => {
    //query this after promise to ensure clientID, jobID and propertyID is set
    return Promise.all([
      //get all Job Types that describe this job
      knex('Jobs')
        .select('Job_Types.job_type')
        .join('Jobs_Job_Types', 'Jobs.job_id', 'Jobs_Job_Types.job_id')
        .join('Job_Types', 'Jobs_Job_Types.job_type_id', 'Job_Types.job_type_id')
        .where('Jobs.job_id', jobID)
        .then(data => {
          Job.Jobs.job_types = data.map( type => type.job_type)
        }),
      //get Client Type of each Client
      knex('Clients')
        .select(
          'Clients.client_id',
          'Client_Types.client_type'
          )
        .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
        .join('Client_Types', 'Client_Specs_Per_Job.client_type_id', 'Client_Types.client_type_id')
        .whereIn('Clients.client_id', clientID)
        .then(data => Job.Client_Types = data),
      //get address 
      knex('Properties')
        .select(
          'Addresses.address',
          'Properties_Addresses.is_primary'
        )
        .join('Properties_Addresses', 'Properties.property_id', 'Properties_Addresses.property_id')
        .join('Addresses', 'Properties_Addresses.address_id', 'Addresses.address_id')
        .whereIn('Properties.property_id', propertyID)
        .then(data => {
          if(Job.Properties[0]) {
            Job.PropertyAddresses = data.map(query => {
              return {
                address: query.address,
                is_primary: query.is_primary
              }
            })
          }
        }),  
      //get roads  
      knex('Properties')
        .select('Roads.road')
        .join('Properties_Roads', 'Properties.property_id', 'Properties_Roads.property_id')
        .join('Roads', 'Properties_Roads.road_id', 'Roads.road_id')
        .whereIn('Properties.property_id', propertyID)
        .then(data => {
          if(Job.Properties[0]) {
            Job.PropertiesRoads = data.map(road => road.road)
          }
        }),  
      //get Rep that matches client and job id.    
      knex('Representatives')
        .select(
          'Clients.client_id',
          'Representatives.representative_id',
          'Representatives.first_name as First Name',
          'Representatives.middle_name as Middle Name',
          'Representatives.last_name as Last Name',
          'Representatives.email as Email',
          'Representatives.business_phone as Business Phone',
          'Representatives.mobile_phone as Mobile Phone'
        )
        .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
        .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
        .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
        .where('Jobs.job_number', job_number)
        .whereIn('Clients.client_id', clientID)
        .then(data => Job.Representatives = data)
    ]).then( () => res.send(Job))
  })
})



router.post('/api/getJobMain', ({body: {job_number} }, res) => {
  let jobMain = {}
  let mainClientId
  let propertyId
  let allClientIds

  return Promise.all([
    knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .join('Client_Types', 'Client_Specs_Per_Job.client_type_id', 'Client_Types.client_type_id')
      .where('Jobs.job_number', job_number)
      .where('Client_Types.client_type', 'Owner')
      .then( data => jobMain.Owner = data[0]),

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
        allClientIds = data.map(client => client.client_id)
        jobMain.Clients = data
      }),

    knex('Clients')
      .select(
        'Clients.client_id',
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name',
        'Clients.email',
        'Clients.business_phone',
        'Clients.mobile_phone',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip'
      )
      .join('Client_Specs_Per_Job', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
      .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
      .leftJoin('Addresses', 'Clients.address_id', 'Addresses.address_id')      
      .leftJoin('Cities', 'Clients.city_id', 'Cities.city_id') 
      .leftJoin('States', 'Clients.state_id', 'States.state_id')      
      .leftJoin('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')      
      .where('Jobs.job_number', job_number)
      .where('Client_Specs_Per_Job.main', true )
      .then(data => {
        mainClientId = data[0].client_id
        jobMain.Main = data[0]
      }),

    knex('Properties')
      .select(
        'Properties.property_id',
        'Properties.Map', 
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
        propertyId = data[0].property_id
        jobMain.Property = data[0]
      }),
  ]) 
  .then( () => {
    return Promise.all([
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
        .then(data => jobMain.Representatives = data),
       //get address 
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
        }),  
      //get roads  
      knex('Properties')
        .select('Roads.road')
        .join('Properties_Roads', 'Properties.property_id', 'Properties_Roads.property_id')
        .join('Roads', 'Properties_Roads.road_id', 'Roads.road_id')
        .whereIn('Properties.property_id', propertyId)
        .then(data => {
          if(jobMain.Property) {
            jobMain.Property.roads = data.map(road => road.road)
          }
        }),  
      knex('Representatives')
        .select(
          'Clients.client_id',
          'Representatives.representative_id',
          'Representatives.first_name',
          'Representatives.middle_name',
          'Representatives.last_name',
          'Representatives.email',
          'Representatives.business_phone',
          'Representatives.mobile_phone'
        )
        .join('Client_Specs_Per_Job', 'Representatives.representative_id', 'Client_Specs_Per_Job.representative_id')
        .join('Jobs', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
        .join('Clients', 'Client_Specs_Per_Job.client_id', 'Clients.client_id')
        .where('Jobs.job_number', job_number)
        .where('Clients.client_id', mainClientId)
        .then( data => jobMain.Main.Rep = data[0])
    ])
    .then( () => res.send(jobMain))     
  })     
})

module.exports = router