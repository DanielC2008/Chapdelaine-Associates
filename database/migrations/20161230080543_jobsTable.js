'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Jobs', table => {
    table.increments('job_id')
    table.integer('invoice_id').unsigned().references('invoice_id').inTable('Invoices')
    table.integer('estimate_id').unsigned().references('estimate_id').inTable('Estimates')
    table.integer('user_id').unsigned().references('user_id').inTable('Users')
    table.string('job_number')
    table.date('start_date')
    table.date('complete_date')
    table.timestamps(true, true)
    table.timestamp('last_accessed')
    table.string('job_status').defaultTo('Pending')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('Jobs')
}