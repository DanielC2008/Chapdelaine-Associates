'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Clients_Representatives', table => {
      table.integer('job_id').unsigned().references('job_id').inTable('Jobs')
      table.integer('representative_id').unsigned().references('representative_id').inTable('Representatives')
      table.integer('client_id').unsigned().references('client_id').inTable('Clients')
    })
}

module.exports.down = (knex, Promise) => {
   return knex.schema.dropTableIfExists('Clients_Representatives')
}