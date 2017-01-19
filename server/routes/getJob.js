'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/getJobInfo', ({body: {job_number} }, res) => {
  //when connected to database
  let Job = {}

  return Promise.all([

    knex('Jobs')
      .select(
        'job_number',
        'job_status',
        'start_date',
        'complete_date',
        'updated_at'
      )
      .where('job_number', job_number)
      .then(data => Job.Job = data),

    knex('Clients')
      .select(
        'Clients.first_name',
        'Clients.middle_name',
        'Clients.last_name',
        'Clients.email',
        'Clients.business_phone',
        'Clients.mobile_phone',
        'Clients.home_phone',
        'Clients.fax_number',
        'Clients.address',
        'Clients.city',
        'Clients.state',
        'Clients.zip_code',
        'Clients.county',
        'Clients.notes',
        'Representatives.first_name as rep_first_name',
        'Representatives.middle_name as rep_middle_name',
        'Representatives.last_name as rep_last_name',
        'Representatives.email as rep_email',
        'Representatives.business_phone as rep_business_phone',
        'Representatives.mobile_phone as rep_mobile_phone',
        'Representatives.home_phone as rep_home_phone',
        'Representatives.fax_number as rep_fax_number',
        'Representatives.address as rep_address',
        'Representatives.city as rep_city',
        'Representatives.state as rep_state',
        'Representatives.zip_code as rep_zip_code',
        'Representatives.county as rep_county',
        'Representatives.notes as rep_notes'
      )
      .where('job_number', job_number)
      .join('Jobs_Clients', 'Clients.client_id', '=', 'Jobs_Clients.client_id')
      .join('Jobs', 'Jobs_Clients.job_id', '=', 'Jobs.job_id')
      .join('Representatives', 'Clients.client_id', '=', 'Representatives.client_id')
      .then(data => {
        Job.Clients = data
      }),

    knex('Properties')
      .select(
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
      .join('Jobs_Properties', 'Properties.property_id', '=', 'Jobs_Properties.property_id')
      .join('Jobs', 'Jobs_Properties.job_id', '=', 'Jobs.job_id')
      .where('job_number', job_number)
      .then(data => Job.Property = data),

  ]).then( () => {
    res.send(Job)
  })



  //when not 
  // res.send(body)
})

module.exports = router