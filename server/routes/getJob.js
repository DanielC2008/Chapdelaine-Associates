'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  //when connected to database

  //could break this out into multiple database calls
  let Job = {}

  return Promise.all([

    knex('Jobs')
      .select(
        'job_number as Job Number',
        'job_status as Job Status',
        'start_date as Date Started',
        'complete_date as Date Completed',
        'updated_at as Last Updated'
      )
      .where('job_number', job_number)
      .then(data => Job.Job = data),

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
        'Clients.notes as Notes',
        'Representatives.representative_id',
        'Representatives.first_name as Rep First Name',
        'Representatives.middle_name as Rep Middle Name',
        'Representatives.last_name as Rep Last Name',
        'Representatives.email as Rep Email',
        'Representatives.business_phone as Rep Business Phone',
        'Representatives.mobile_phone as Rep Mobile Phone',
        'Representatives.home_phone as Rep Home Phone',
        'Representatives.fax_number as Rep Fax Number',
        'Representatives.address as Rep Address',
        'Representatives.city as Rep City',
        'Representatives.state as Rep State',
        'Representatives.zip_code as Rep Zip Code',
        'Representatives.county as Rep County',
        'Representatives.notes as Rep Notes'
      )
      .where('job_number', job_number)
      .join('Jobs_Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
      .join('Jobs', 'Jobs_Clients.job_id', '=', 'Jobs.job_id')
      .join('Representatives', 'Clients.client_id', '=', 'Representatives.client_id')
      .then(data => Job.Clients = data),

    knex('Properties')
      .select(
        'Properties.property_id',
        'address',
        'city',
        'state',
        'zip_code',
        'county',
        'map',
        'parcel_number',
        'plat_page',
        'plat_book',
        'deed_book',
        'deed_page',
        'sub_division',
        'notes'
      )
      .join('Jobs_Properties', 'Properties.property_id', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', 'Jobs.job_id')
      .where('job_number', job_number)
      .then(data => Job.Property = data),

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
        .then(data => Job.Estimate = data),

      knex('Invoices')
        .select(
          'Invoices.invoice_id',
          'Invoices.invoice_number', 
          'Types_of_Work.type_of_work',
          'Types_of_Work.rate',
          'Types_of_Work.hourly'
        )
        .join('Jobs', 'Jobs.invoice_id', 'Invoices.invoice_id')
        .join('Types_Invoices', 'Types_Invoices.invoice_id', 'Invoices.invoice_id')
        .join('Types_Of_Work', 'Types_Invoices.type_of_work_id', 'Types_Of_Work.type_of_work_id')
        .where('job_number', job_number)
        .then(data => Job.Invoice = data)

  ]).then( () => {
    res.send(Job)
  })



  //when not 
  // res.send(body)
})

module.exports = router