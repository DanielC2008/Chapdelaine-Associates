'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const validTask = require('../validation/validTask')


router.post('/api/validateTask', ({body: {dbObj}}, res) => {
  const errors = validTask.validate(dbObj, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {  
    res.send({msg: 'Valid Task'})
  }
})
  
router.get('/api/getEnabledTasks', (req, res) => {
  knex('Tasks')
  .where({disabled: false})
  .then( data => res.send(data))
})

router.post('/api/addNewTask', ({body: {dbObj}}, res) => {
  knex('Tasks')
  .insert(dbObj)
  .then( () => res.send({msg: 'Successfully added Task!'}))
  .catch( err => console.log('err', err))
})

router.post('/api/updateTask', ({body: {dbObj, ids}}, res) => {
  const errors = validTask.validate(dbObj, {typecast: true})
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {  
    knex('Tasks')
    .update(dbObj)
    .where({task_id: ids.task_id})
    .then( () => res.send({msg: 'Successfully updated Task!'}))
    .catch( err => console.log('err', err))
  }
})

router.post('/api/disableTask', ({body: {id}}, res) => {
  knex('Tasks')
  .update({disabled: true})
  .where({task_id: id})
  .then( () => res.send({msg: 'Successfully disabled Task!'}))
  .catch( err => console.log('err', err))
})


module.exports = router