'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.integer('main_client_id').unsigned().references('client_id').inTable('Clients').defaultTo(null) 
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('main_client_id')
  })
}