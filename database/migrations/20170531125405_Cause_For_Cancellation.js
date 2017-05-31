'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Cause_For_Cancellation', table => {
      table.increments('cause_id').unique()
      table.string('cause')
    })
}

module.exports.down = (knex, Promise) => {
   return knex.schema.dropTableIfExists('Cause_For_Cancellation')
}