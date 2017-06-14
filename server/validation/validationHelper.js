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

const checkNameExistsOnEdit = (id, edited, table) => {
  return new Promise( (resolve, reject) => {
    //first,middle, last exists ? check name: resolve false
    if (edited.first_name || edited.middle_name || edited.last_name) {
    // find old name first
    knex(`${table}`)
      .select('first_name','middle_name', 'last_name')
      .where(id)
      .then(data => {
        let old = data[0]
        // set name! if edited.name use that. otherwise use old name
        let newName = {
          first_name: edited.first_name ? edited.first_name : old.first_name,
          middle_name: edited.middle_name ? edited.middle_name : old.middle_name,
          last_name: edited.last_name ? edited.last_name : old.last_name
        }
        // check name
        knex(`${table}`)
          .where(newName)
          .then(data => {
            let exists = data[0] ? true : false
            resolve(exists)
          })
      })
    } else {
      resolve(false)
    }
  })
} 



module.exports = {checkEmail, checkNameExists, checkNameExistsOnEdit}