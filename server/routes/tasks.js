'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const validTask = require('../validation/validTask')

  
router.get('/api/getAllTasks', (req, res) => knex('Tasks').then( data => res.send(data)))

router.post('/api/addNewTask', ({body: {dbObj}}, res) => {
  const errors = validTask.validate(dbObj, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {  
    knex('Tasks')
    .insert(dbObj)
    .then( () => res.send({msg: 'Successfully added Task!'}))
    .catch( err => console.log('err', err))
  }
})

router.post('/api/updateTask', ({body: {ids, task}}, res) => {
  const errors = validTask.validate(task, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {  
    knex('Tasks')
    .update(task)
    .where({task_id: ids.task_id})
    .then( () => res.send({msg: 'Successfully updated Task!'}))
    .catch( err => console.log('err', err))
  }
})


module.exports = router