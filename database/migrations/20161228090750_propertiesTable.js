'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Properties', table => {
    table.increments('property_id')
    table.string('address')
    table.string('city')
    table.string('state')
    table.string('zip_code')
    table.string('county')
    table.string('map')
    table.string('parcel_number')
    table.string('deed_book')
    table.string('page')
    table.string('plat_book')
    table.string('sub_division')
    table.string('notes')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('Properties')
}