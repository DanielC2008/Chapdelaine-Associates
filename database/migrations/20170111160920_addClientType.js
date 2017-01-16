'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Clients', table => {
    table.string('client_type')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Users', table => {
    table.dropColumn("client_type")
  })
}