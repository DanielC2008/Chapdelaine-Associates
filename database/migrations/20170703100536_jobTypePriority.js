'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Job_Types', table => {
    table.integer('priority')
    table.boolean('disabled').defaultTo(false)
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Job_Types', table => {
    table.dropColumn('disabled')
    table.dropColumn('priority')
  })
}