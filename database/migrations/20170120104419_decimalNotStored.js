'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Employees', table => {
    table.decimal('pay_rate')
  }).table('Types_Of_Work', table => {
    table.decimal('rate')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Types_Of_Work', table => {
    table.dropColumn('rate')
  }).table('Employees', table => {
    table.dropColumn('pay_rate')
  })
}