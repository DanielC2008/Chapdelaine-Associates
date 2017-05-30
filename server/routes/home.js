'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/activeJobs', (req, res) => {
 knex('Jobs')
    .select('Clients.first_name', 'Clients.last_name', 'Jobs.job_status', 'Jobs.job_number')
    .join('Client_Specs_Per_Job', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
    .join('Clients', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
    .where('job_status', 'Active')
    .orderBy('last_accessed', 'desc')
    .limit(25)
    .then(data => res.send(data))
})

router.get('/api/pendingJobs', (req, res) => {
  knex('Jobs')
    .select('Clients.first_name', 'Clients.last_name', 'Jobs.job_status', 'Jobs.job_number')
    .join('Client_Specs_Per_Job', 'Client_Specs_Per_Job.job_id', 'Jobs.job_id')
    .join('Clients', 'Clients.client_id', 'Client_Specs_Per_Job.client_id')
    .where('job_status', 'Pending')
    .orderBy('last_accessed', 'desc')
    .limit(25)
    .then(data => res.send(data))
})


module.exports = router