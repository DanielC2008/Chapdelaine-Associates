'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  //when connected to database

  //could break this out into multiple database calls
  let Job = {}
  let clientID

  return Promise.all([

    knex('Jobs')
      .select(
        'job_id',
        'job_number as Job Number',
        'job_status as Job Status',
        'start_date as Date Started',
        'complete_date as Date Completed',
        'updated_at as Last Updated'
      )
      .where('job_number', job_number)
      .then(data => Job.Jobs = data),

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
        'Clients.address as Address',
        'Clients.city as City',
        'Clients.state as State',
        'Clients.zip_code as Zip Code',
        'Clients.county as County',
        'Clients.notes as Notes'
      )
      .join('Jobs_Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
      .join('Jobs', 'Jobs_Clients.job_id', 'Jobs.job_id')
      .where('job_number', job_number)
      .then(data => {
        clientID = data.map(client => client.client_id)
        Job.Clients = data
      }),

    knex('Properties')
      .select(
        'Properties.property_id',
        'address as Address',
        'city as City',
        'state as State',
        'zip_code as Zip Code',
        'county as County',
        'map as Map',
        'parcel_number as Parcel Number',
        'plat_book as Plat Book',
        'plat_page as Plat Page',
        'deed_book as Deed Book',
        'deed_page as Deed Page',
        'sub_division as Sub Division',
        'notes as Notes'
      )
      .join('Jobs_Properties', 'Properties.property_id', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', 'Jobs.job_id')
      .where('job_number', job_number)
      .then(data => Job.Properties = data),

      knex('Estimates')
        .select(
          'Estimates.estimate_id',
          'Estimates.date_created', 
          'Estimates.notes',
          'Types_of_Work.type_of_work',
          'Types_of_Work.rate',
          'Types_of_Work.hourly'
        )
        .join('Jobs', 'Jobs.estimate_id', 'Estimates.estimate_id')
        .join('Types_Estimates', 'Types_Estimates.estimate_id', 'Estimates.estimate_id')
        .join('Types_Of_Work', 'Types_Estimates.type_of_work_id', 'Types_Of_Work.type_of_work_id')
        .where('job_number', job_number)
        .then(data => Job.Estimates = data),

      knex('Invoices')
        .select(
          'Invoices.invoice_number'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .where('job_number', job_number)
        .then(data => Job.Invoices = data),

      knex('Invoices')
        .select(
          'Types_of_Work.type_of_work',
          'Types_of_Work.type_of_work_id',
          'Types_of_Work.rate',
          'Types_of_Work.hourly',
          'Types_Invoices.time_if_hourly',
          'Types_Invoices.types_invoices_id'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .join('Types_Invoices', 'Types_Invoices.invoice_id', 'Invoices.invoice_id')
        .join('Types_Of_Work', 'Types_Invoices.type_of_work_id', 'Types_Of_Work.type_of_work_id')
        .where('job_number', job_number)
        .then(data => Job.InvoiceDetails = data)

  ]).then( () => {
    //query this after promise to ensure clientID is set
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
        'Representatives.address as Address',
        'Representatives.city as City',
        'Representatives.state as State',
        'Representatives.zip_code as Zip Code',
        'Representatives.county as County',
        'Representatives.notes as Notes'
      )
      .join('Clients_Representatives', 'Representatives.representative_id', 'Clients_Representatives.representative_id')
      .join('Jobs', 'Clients_Representatives.job_id', 'Jobs.job_id')
      .join('Clients', 'Clients_Representatives.client_id', 'Clients.client_id')
      .where('Jobs.job_number', job_number)
      .whereIn('Clients.client_id', clientID)
      .then(data => {
        Job.Representatives = data
        res.send(Job)
      })
  })

  //when not 
  // res.send(body)
})

module.exports = router