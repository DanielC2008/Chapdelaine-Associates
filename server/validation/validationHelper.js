'use strict'

const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)

const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const checkNameExists = (obj, table) => {
  let name = {
    first_name: obj.first_name,
    middle_name: obj.middle_name,
    last_name: obj.last_name
  }
  return new Promise( (resolve, reject) => {
    knex(`${table}`)
      .where(name)
      .then(data => {
        let exists = data[0] ? true : false
        resolve(exists)
      })
  })
} 



module.exports = {checkEmail, checkNameExists}