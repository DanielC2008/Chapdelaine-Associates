'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .createTable('Client_Types', table => {
    table.increments('client_type_id').notNullable(),
    table.string('client_type')
  })
  .createTable('Job_Types', table => {
    table.increments('job_type_id').notNullable(),
    table.string('job_type')
  })
  .createTable('States', table => {
    table.increments('state_id').notNullable(),
    table.string('state')
  })
  .createTable('Cities', table => {
    table.increments('city_id').notNullable(),
    table.string('city')
  })
  .createTable('Counties', table => {
    table.increments('county_id').notNullable(),
    table.string('county')
  })
  .createTable('Zip_Codes', table => {
    table.increments('zip_id').notNullable(),
    table.string('zip')
  })
  .createTable('Roads', table => {
    table.increments('road_id').notNullable(),
    table.string('road')
  })
  .createTable('Addresses', table => {
    table.increments('address_id').notNullable(),
    table.string('address')
  })
  .createTable('Jobs_Job_Types', table => {
    table.integer('job_id').unsigned().references('job_id').inTable('Jobs').notNullable(),
    table.integer('job_type_id').unsigned().references('job_type_id').inTable('Job_Types').notNullable()
  })
  .createTable('Properties_Roads', table => {
    table.integer('property_id').unsigned().references('property_id').inTable('Properties').notNullable(),
    table.integer('road_id').unsigned().references('road_id').inTable('Roads').notNullable()
  })
  .createTable('Properties_Addresses', table => {
    table.integer('property_id').unsigned().references('property_id').inTable('Properties').notNullable(),
    table.integer('address_id').unsigned().references('address_id').inTable('Addresses').notNullable(),
    table.boolean('is_primary').defaultTo(false)
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .dropTableIfExists('Properties_Addresses')
  .dropTableIfExists('Properties_Roads')
  .dropTableIfExists('Jobs_Job_Types')
  .dropTableIfExists('Addresses')
  .dropTableIfExists('Roads')
  .dropTableIfExists('Zip_Codes')
  .dropTableIfExists('Counties')
  .dropTableIfExists('Cities')
  .dropTableIfExists('States')
  .dropTableIfExists('Job_Types')
  .dropTableIfExists('Client_Types')
}