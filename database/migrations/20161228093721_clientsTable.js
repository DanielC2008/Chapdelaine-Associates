'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Clients', table => {
    table.increments('client_id').unique()
    table.string('first_name')
    table.string('middle_name')
    table.string('last_name')
    table.string('email')
    table.string('business_phone', 11)
    table.string('mobile_phone', 11)
    table.string('home_phone', 11)
    table.string('fax_number', 11)
    table.string('address')
    table.string('city')
    table.string('state')
    table.string('zip_code')
    table.string('county')
    table.string('notes')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('Clients')
}