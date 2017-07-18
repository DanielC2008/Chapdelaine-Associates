'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('job_on_hold')
    table.boolean('on_hold').defaultTo(false) 
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Jobs', table => {
    table.dropColumn('on_hold')
  })
}