'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Users', table => {
    table.increments('user_id')
    table.string('email').unique()
    table.string('password')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('Users')
}