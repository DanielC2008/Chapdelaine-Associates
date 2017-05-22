'use strict'
//-------------------------------------------------------I should only bring back only essential job info when job is loaded and break these out into smaller queries
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
        'Clients.mobile_phone as Mobile Phone',
        'Clients.home_phone as Home Phone',
        'Clients.fax_number as Fax Number',
        'Clients.notes as Notes',
        'Addresses.address',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip',
        'Counties.county'
      )
      .join('Jobs_Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
      .join('Jobs', 'Jobs_Clients.job_id', 'Jobs.job_id')
      .join('Addresses', 'Clients.address_id', 'Addresses.address_id')
      .join('Cities', 'Clients.city_id', 'Cities.city_id')
      .join('States', 'Clients.state_id', 'States.state_id')
      .join('Zip_Codes', 'Clients.zip_id', 'Zip_Codes.zip_id')
      .join('Counties', 'Clients.county_id', 'Counties.county_id')
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
        'Properties.acres as Acres',
        'Cities.city',
        'States.state',
        'Zip_Codes.zip',
        'Counties.county'
      )
      .join('Jobs_Properties', 'Properties.property_id', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', 'Jobs.job_id')
      .join('Cities', 'Properties.city_id', 'Cities.city_id')
      .join('States', 'Properties.state_id', 'States.state_id')
      .join('Zip_Codes', 'Properties.zip_id', 'Zip_Codes.zip_id')
      .join('Counties', 'Properties.county_id', 'Counties.county_id')
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
          'Types_of_Work.type_of_work',
          'Types_of_Work.type_of_work_id',
          'Types_of_Work.rate',
          'Types_of_Work.hourly',
          'Types_Estimates.time_if_hourly',
          'Types_Estimates.rate_if_modified',
          'Types_Estimates.types_estimates_id'
        )
        .join('Jobs', 'Jobs.estimate_id', 'Estimates.estimate_id')
        .join('Types_Estimates', 'Types_Estimates.estimate_id', 'Estimates.estimate_id')
        .join('Types_Of_Work', 'Types_Estimates.type_of_work_id', 'Types_Of_Work.type_of_work_id')
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
          'Types_of_Work.type_of_work',
          'Types_of_Work.type_of_work_id',
          'Types_of_Work.rate',
          'Types_of_Work.hourly',
          'Types_Invoices.time_if_hourly',
          'Types_Invoices.rate_if_modified',
          'Types_Invoices.status',
          'Types_Invoices.target_date',
          'Types_Invoices.types_invoices_id'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .join('Types_Invoices', 'Types_Invoices.invoice_id', 'Invoices.invoice_id')
        .join('Types_Of_Work', 'Types_Invoices.type_of_work_id', 'Types_Of_Work.type_of_work_id')
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

      knex('Jobs')
        .select('Job_Types.job_type')
        .join('Jobs_Job_Types', 'Jobs.job_id', 'Jobs_Job_Types.job_id')
        .join('Job_Types', 'Jobs_Job_Types.job_type_id', 'Job_Types.job_type_id')
        .where('Jobs.job_id', jobID)
        .then(data => {
          Job.Jobs.job_types = data.map( type => type.job_type)
        }),

        knex('Properties')
          .select(
            'Addresses.address',
            'Properties_Addresses.is_primary',
            'Roads.road'
          )
          .join('Properties_Addresses', 'Properties.property_id', 'Properties_Addresses.property_id')
          .join('Addresses', 'Properties_Addresses.address_id', 'Addresses.address_id')
          .join('Properties_Roads', 'Properties.property_id', 'Properties_Roads.property_id')
          .join('Roads', 'Properties_Roads.road_id', 'Roads.road_id')
          .whereIn('Properties.property_id', propertyID)
          .then(data => {
            if(Job.Properties[0]) {
              Job.Properties[0].addresses = data.map(query => {
                return {
                  address: query.address,
                  is_primary: query.is_primary
                }
              })
              Job.Properties[0].roads = data.map(road => road.road)
            }
          }),  

      knex('Representatives')
        .select(
          'Clients.client_id',
          'Representatives.representative_id',
          'Representatives.first_name as First Name',
          'Representatives.middle_name as Middle Name',
          'Representatives.last_name as Last Name',
          'Representatives.email as Email',
          'Representatives.business_phone as Business Phone',
          'Representatives.mobile_phone as Mobile Phone',
          'Representatives.home_phone as Home Phone',
          'Representatives.fax_number as Fax Number',
          'Representatives.notes as Notes',
          'Addresses.address',
          'Cities.city',
          'States.state',
          'Zip_Codes.zip',
          'Counties.county'
        )
        .join('Clients_Representatives', 'Representatives.representative_id', 'Clients_Representatives.representative_id')
        .join('Jobs', 'Clients_Representatives.job_id', 'Jobs.job_id')
        .join('Clients', 'Clients_Representatives.client_id', 'Clients.client_id')
        .join('Addresses', 'Representatives.address_id', 'Addresses.address_id')
        .join('Cities', 'Representatives.city_id', 'Cities.city_id')
        .join('States', 'Representatives.state_id', 'States.state_id')
        .join('Zip_Codes', 'Representatives.zip_id', 'Zip_Codes.zip_id')
        .join('Counties', 'Representatives.county_id', 'Counties.county_id')
        .where('Jobs.job_number', job_number)
        .whereIn('Clients.client_id', clientID)
        .then(data => {
          Job.Representatives = data
          res.send(Job)
        })
    ])  
  })
})

module.exports = router