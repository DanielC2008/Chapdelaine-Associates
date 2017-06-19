'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Properties', table => {
    table.integer('primary_address_id').unsigned().references('address_id').inTable('Addresses')  
    table.integer('primary_road_id').unsigned().references('road_id').inTable('Roads')  
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Properties', table => {
    table.dropColumn('primary_road_id')
    table.dropColumn('primary_address_id')
  })
}