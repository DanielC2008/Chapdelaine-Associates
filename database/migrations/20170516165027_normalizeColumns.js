'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Properties', table => {
    table.integer('state_id').unsigned().references('state_id').inTable('States'),
    table.integer('city_id').unsigned().references('city_id').inTable('Cities'),
    table.integer('county_id').unsigned().references('county_id').inTable('Counties'),
    table.integer('zip_id').unsigned().references('zip_id').inTable('Zip_Codes')
  })
  .table('Clients', table => {
    table.integer('state_id').unsigned().references('state_id').inTable('States'),
    table.integer('city_id').unsigned().references('city_id').inTable('Cities'),
    table.integer('county_id').unsigned().references('county_id').inTable('Counties'),
    table.integer('zip_id').unsigned().references('zip_id').inTable('Zip_Codes'),
    table.integer('address_id').unsigned().references('address_id').inTable('Addresses'),
    table.integer('client_type_id').unsigned().references('client_type_id').inTable('Client_Types')
  })
  .table('Representatives', table => {
    table.integer('state_id').unsigned().references('state_id').inTable('States'),
    table.integer('city_id').unsigned().references('city_id').inTable('Cities'),
    table.integer('county_id').unsigned().references('county_id').inTable('Counties'),
    table.integer('zip_id').unsigned().references('zip_id').inTable('Zip_Codes'),
    table.integer('address_id').unsigned().references('address_id').inTable('Addresses')
  })
  .table('Employees', table => {
    table.integer('state_id').unsigned().references('state_id').inTable('States'),
    table.integer('city_id').unsigned().references('city_id').inTable('Cities'),
    table.integer('county_id').unsigned().references('county_id').inTable('Counties'),
    table.integer('zip_id').unsigned().references('zip_id').inTable('Zip_Codes'),
    table.integer('address_id').unsigned().references('address_id').inTable('Addresses')
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Employees', table => {
    table.dropColumn('state_id'),
    table.dropColumn('city_id'),
    table.dropColumn('county_id'),
    table.dropColumn('zip_id'),
    table.dropColumn('address_id')
  })
  .table('Representatives', table => {
    table.dropColumn('state_id'),
    table.dropColumn('city_id'),
    table.dropColumn('county_id'),
    table.dropColumn('zip_id'),
    table.dropColumn('address_id')
  })
  .table('Clients', table => {
    table.dropColumn('state_id'),
    table.dropColumn('city_id'),
    table.dropColumn('county_id'),
    table.dropColumn('zip_id'),
    table.dropColumn('address_id'),
    table.dropColumn('client_type_id')
  })
  .table('Clients', table => {
    table.dropColumn('state_id'),
    table.dropColumn('city_id'),
    table.dropColumn('county_id'),
    table.dropColumn('zip_id')
  })
}