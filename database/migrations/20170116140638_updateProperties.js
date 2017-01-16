'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.table('Properties', table => {
    table.renameColumn('page', 'plat_page')
    table.string('deed_page')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.table('Properties', table => {
    table.dropColumn('plat_page')
    table.dropColumn('deed_page')
  })
}