'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('is_Table_Searchable', table => {
    table.string('table_name'),
    table.boolean('find_job'),
    table.boolean('get_data')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('is_Table_Searchable')
}