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
      let exists = data[0] ? 'It appears this name already exists.' : false
      resolve(exists)
    })
  })
} 

const checkNameExistsOnEdit = (idObj, edited, table) => {
  console.log('idObj, edited, table', idObj, edited, table)
  return new Promise( (resolve, reject) => {
    //find client's old previous name
    knex(`${table}`)
    .select('first_name','middle_name', 'last_name')
    .where(idObj)
    .then(data => {
      let old = data[0]
      //check if the name has changed
      if( !nameChanged(old, edited)) {
        resolve(false)
      }
      //build new name 
      let newName = {
        first_name: edited.first_name ? edited.first_name : old.first_name,
        middle_name: edited.middle_name ? edited.middle_name : old.middle_name,
        last_name: edited.last_name ? edited.last_name : old.last_name
      }
      // check new name
      knex(`${table}`)
      .where(newName)
      .then(data => {

        let exists = data[0] ? 'It appears this name already exists.' : false
        resolve(exists)
      })
    })
  })
} 

const nameChanged = (o, n) => {
  if (o.first_name === n.first_name && o.middle_name === n.middle_name && o.last_name === n.last_name) {
    return false
  } else {
    return true
  }
}


module.exports = {checkEmail, checkNameExists, checkNameExistsOnEdit}