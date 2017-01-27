'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Time_Cards', table => {
    table.renameColumn('lunch', 'lunch_in')
    table.time('lunch_out')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Time_Cards', table => {
    table.dropColumn('lunch_out')
    table.dropColumn('lunch_in')
  })
}  