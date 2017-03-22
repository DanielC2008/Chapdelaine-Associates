'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.post('/api/register', ({body}, res) => {
  knex('Users')
    .returning('user_name')
    .insert(body)
    .then( data => {
      res.send({user_name: data[0]})
    })
    .catch( err => {
      if (err.code === "EREQUEST") {
        res.send({msg: "User Name already exists. Please create another."})
      } else {
        res.send({msg: "An error has occured. Please try again."})
      }
    })
})

router.post('/api/login', ({body: {user_name, password}, session}, res) => {
  knex('Users')
    .where({user_name})
    .then( listedUsers => {
      let [user] = listedUsers
      if (password === user.password){
        session.user = user.user_name
        res.send({user_name: session.user})
      } else {
        res.send({msg: "User Name and/or password incorrect."})
      }
    })
    .catch( err => {
      console.log('err', err);
      res.send({msg: "An error has occured. Please try again."})
    })
})

router.get('/api/getUserName', ({session}, res) => res.send({user_name: session.user}))

router.get('/api/removeUser', ({session}, res) => {
  session.destroy()
  res.send()
})

module.exports = router