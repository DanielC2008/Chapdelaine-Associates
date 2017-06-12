'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .createTable('Companies', table => {
    table.increments('company_id').notNullable(),
    table.string('company_name'),
    table.integer('address_id').unsigned().references('address_id').inTable('Addresses')
  })
  .table('Representatives', table => {
    table.integer('company_id').unsigned().references('company_id').inTable('Companies')
  })  
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Representatives', table => {
    table.dropColumn('company_id')
  })  
  .dropTableIfExists('Companies')
}