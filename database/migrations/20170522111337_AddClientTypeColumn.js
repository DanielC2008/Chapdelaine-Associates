'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Clients_Representatives', table => {
    table.integer('client_type_id').unsigned().references('client_type_id').inTable('Client_Types')
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Clients_Representatives', table => {
    table.dropColumn('client_type_id')
  })
}