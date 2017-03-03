'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Types_Estimates', table => {
    table.increments('types_estimates_id')
  }).table('Types_Invoices', table => {
    table.integer('types_invoices_id')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Types_Invoices', table => {
    table.dropColumn('types_invoices_id')
  }).table('Types_Estimates', table => {
    table.dropColumn('types_estimates_id')
  })
}