'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Types_Invoices', table => {
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('invoice_id').unsigned().references('invoice_id').inTable('Invoices')
    }).createTable('Types_Estimates', table => {
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('estimate_id').unsigned().references('estimate_id').inTable('Estimates')
    }).createTable('Types_Cards', table => {
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('time_card_id').unsigned().references('time_card_id').inTable('Time_Cards')
    })
}

module.exports.down = (knex, Promise) => {
   return knex.schema.dropTableIfExists('Types_Cards')
    .dropTableIfExists('Types_Estimates')
    .dropTableIfExists('Types_Invoices')
}