'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Users', table => {
    table.renameColumn("email", "userName")
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Users', table => {
    table.renameColumn("userName", "email")
  })
}