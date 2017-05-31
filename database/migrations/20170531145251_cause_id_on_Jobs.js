'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.integer('cause_id').unsigned().references('cause_id').inTable('Cause_For_Cancellation')
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('cause_id')
  })
}