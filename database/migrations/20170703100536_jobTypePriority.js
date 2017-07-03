'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Job_Types', table => {
    table.integer('priority').unique()
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Job_Types', table => {
    table.dropColumn('priority')
  })
}