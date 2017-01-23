'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.post('/api/editColumn', ({body: {table, id, obj}}, res) => {
  knex(`${table}`)
    .returning('*')
    .update(obj)
    .where(id)
    .then( data => {
      console.log(data);
      // res.send({user_name: data[0]})
    })
    .catch( err => {
      console.log(err);
      // if (err.code === "EREQUEST") {
      //   res.send({msg: "User Name already exists. Please create another."})
      // } else {
      //   res.send({msg: "An error has occured. Please try again."})
      // }
    })
})

module.exports = router