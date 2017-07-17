'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.integer('property_id').unsigned().references('property_id').inTable('Properties').defaultTo(null) 
    table.integer('invoice_id').unsigned().references('invoice_id').inTable('Invoices').defaultTo(null)  
    table.integer('estimate_id').unsigned().references('estimate_id').inTable('Estimates').defaultTo(null) 
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('estimate_id')
    table.dropColumn('invoice_id')
    table.dropColumn('property_id')
  })
}