'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Properties', table => {
    table.string('lot_number')
  })
  .table('Representatives', table => {
    table.string('company_name'),
    table.string('company_address')
  })
  .table('Clients', table => {
    table.string('company_name'),
    table.string('company_address')
  })
  .table('Client_Specs_Per_Job', table => {
    table.boolean('main').defaultTo(false)
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Client_Specs_Per_Job', table => {
    table.dropColumn('main')
  })
  .table('Clients', table => {
    table.dropColumn('company_address')
    table.dropColumn('company_name')
  })
  .table('Representatives', table => {
    table.dropColumn('company_address')
    table.dropColumn('company_name')
  })
  .table('Properties', table => {
    table.dropColumn('lot_number')
  })
}