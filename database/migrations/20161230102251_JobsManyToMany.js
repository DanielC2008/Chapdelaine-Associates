'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Jobs_Properties', table => {
      table.integer('job_id').unsigned().references('job_id').inTable('Jobs')
      table.integer('property_id').unsigned().references('property_id').inTable('Properties')
    }).createTable('Jobs_Clients', table => {
      table.integer('job_id').unsigned().references('job_id').inTable('Jobs')
      table.integer('client_id').unsigned().references('client_id').inTable('Clients')
    })
}

module.exports.down = (knex, Promise) => {
   return knex.schema.dropTableIfExists('Jobs_Clients')
    .dropTableIfExists('Jobs_Properties')
}