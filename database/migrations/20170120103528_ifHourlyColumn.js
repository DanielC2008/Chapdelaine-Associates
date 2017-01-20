'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Types_Estimates', table => {
    table.decimal('time_if_hourly')
  }).table('Types_Invoices', table => {
    table.decimal('time_if_hourly')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Types_Invoices', table => {
    table.dropColumn('time_if_hourly')
  }).table('Types_Estimates', table => {
    table.dropColumn('time_if_hourly')
  })
}