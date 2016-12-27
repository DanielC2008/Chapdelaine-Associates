'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Users', table => {
    table.renameColumn("userName", "user_name")
    table.timestamps(true, true)
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Users', table => {
    table.renameColumn("user_name", "userName")
    table.dropTimestamps()
  })
}