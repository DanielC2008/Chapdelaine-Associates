'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.integer('client_id').unsigned().references('customer_id').inTable('Customers').defaultTo(null)
    table.integer('owner_id').unsigned().references('customer_id').inTable('Customers').defaultTo(null)
    table.integer('client_contact_id').unsigned().references('customer_id').inTable('Customers').defaultTo(null)
    table.integer('owner_contact_id').unsigned().references('customer_id').inTable('Customers').defaultTo(null)
    table.integer('client_type_id').unsigned().references('client_type_id').inTable('Client_Types').defaultTo(null)
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('client_type_id')
    table.dropColumn('owner_contact_id')
    table.dropColumn('client_contact_id')
    table.dropColumn('owner_id')
    table.dropColumn('client_id')
  })
}