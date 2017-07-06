'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
  .table('Tasks', table => {
    table.boolean('disabled').defaultTo(false)
  })
}


module.exports.down = (knex, Promise) => {
  return knex.schema
  .table('Tasks', table => {
    table.dropColumn('disabled')
  })
}