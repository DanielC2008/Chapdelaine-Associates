'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .createTable('Job_Statuses', table => {
    table.increments('job_status_id').notNullable()
    table.string('job_status')
  })
  .table('Jobs', table => {
    table.integer('job_status_id').unsigned().references('job_status_id').inTable('Job_Statuses').defaultTo(null)
    table.boolean('job_on_hold') 
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('job_on_hold')
    table.dropColumn('job_status_id')
  })
  .dropTableIfExists('Job_Statuses')
}