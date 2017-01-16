'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.alterTable('Jobs', table => {
    table.unique("job_number")
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.alterTable('Jobs', table => {
    table.dropUnique("job_number")
  })
}