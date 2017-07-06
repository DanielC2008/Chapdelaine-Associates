'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
// const { validClient, validClientOnJob } = require('../validation/validClient')
// const validationHelper = require('../validation/validationHelper') 


router.get('/api/getCompaniesForSearch', (req, res) => {
  knex('Companies')
  .select(
    'company_name',
    'company_id AS id'
  )
  .then( data => res.send(data))
  .catch( err => console.log(err))
}) 

module.exports = router