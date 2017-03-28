'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/activeJobs', (req, res) => {
 knex('Jobs')
    .select('Clients.first_name', 'Clients.last_name', 'Jobs.job_status', 'Jobs.job_number')
    .join('Jobs_Clients', 'Jobs_Clients.job_id', 'Jobs.job_id')
    .join('Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
    .where('job_status', 'Active')
    .then(data => res.send(data))
})

router.get('/api/pendingJobs', (req, res) => {
  knex('Jobs')
    .select('Clients.first_name', 'Clients.last_name', 'Jobs.job_status', 'Jobs.job_number')
    .join('Jobs_Clients', 'Jobs_Clients.job_id', 'Jobs.job_id')
    .join('Clients', 'Clients.client_id', 'Jobs_Clients.client_id')
    .where('job_status', 'Pending')
    .then(data => res.send(data))
})

////////////////////////////////////////////////////////////need to decide whether to use this
router.post('/api/findJob/getTableNames', (req, res) => {
  knex('is_Table_Searchable')
  .select('table_name')
  .where({find_job: true})
  .then( tableNames => {
    res.send(tableNames)
  })
  .catch( err => {
    console.log('err', err)
  })
})


module.exports = router