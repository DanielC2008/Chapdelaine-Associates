'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Time_Cards', table => {
    table.dropColumn('clock_in')
    table.dropColumn('clock_out')
  }).table('Time_Cards', table => {
    table.time('clock_in')
    table.time('clock_out')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Time_Cards', table => {
    table.dropColumn('clock_in')
    table.dropColumn('clock_out')
  })
}