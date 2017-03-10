'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()

router.post('/api/openFile',  ({body: {attachment_id}}, res) => {
 console.log('attachment_id', attachment_id)
})

module.exports = router