'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
  
router.get('/api/getAllTasks', (req, res) => knex('Tasks').then( data => res.send(data)))

router.post('/api/addNewTask', ({body: {dbObj}}, res) => {
  knex('Tasks')
  .insert(dbObj)
  .then( () => res.send({msg: 'Successfully added Task!'}))
  .catch( err => console.log('err', err))
})


module.exports = router