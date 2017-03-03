'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema
    .dropTableIfExists('Types_Invoices')
    .dropTableIfExists('Types_Estimates')
    .dropTableIfExists('Types_Cards')
    .createTable('Types_Invoices', table => {
      table.increments('types_invoices_id')
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('invoice_id').unsigned().references('invoice_id').inTable('Invoices')
      table.decimal('time_if_hourly')
    })
    .createTable('Types_Estimates', table => {
      table.increments('types_estimates_id')
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('estimate_id').unsigned().references('estimate_id').inTable('Estimates')
      table.decimal('time_if_hourly')
    })
    .createTable('Types_Cards', table => {
      table.increments('types_cards_id')
      table.integer('type_of_work_id').unsigned().references('type_of_work_id').inTable('Types_Of_Work')
      table.integer('time_card_id').unsigned().references('time_card_id').inTable('Time_Cards')
    })
}

module.exports.down = (knex, Promise) => {
   return knex.schema
    .dropTableIfExists('Types_Cards')
    .dropTableIfExists('Types_Estimates')
    .dropTableIfExists('Types_Invoices')
}