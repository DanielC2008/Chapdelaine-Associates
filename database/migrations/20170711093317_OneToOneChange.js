'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Properties', table => {
    table.integer('job_id').unsigned().references('job_id').inTable('Jobs')  
  })
  .table('Invoices', table => {
    table.integer('job_id').unsigned().references('job_id').inTable('Jobs')  
  })
  .table('Estimates', table => {
    table.integer('job_id').unsigned().references('job_id').inTable('Jobs')  
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Estimates', table => {
    table.dropColumn('job_id')
  })
  .table('Invoices', table => {
    table.dropColumn('job_id')
  })
  .table('Properties', table => {
    table.dropColumn('job_id')
  })
}