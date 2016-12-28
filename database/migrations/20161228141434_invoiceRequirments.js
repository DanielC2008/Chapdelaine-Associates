'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Types_Of_Work', table => {
      table.increments('type_of_work_id').unique()
      table.string('type_of_work')
      table.decimal('rate')
      table.boolean('hourly')
    }).createTable('Estimates', table => {
      table.increments('estimate_id').unique()
      table.date('date_created')
      table.string('notes') 
    }).createTable('Invoices', table => {
      table.increments('invoice_id').unique()
      table.string('invoice_number')
    }).createTable('Time_Cards', table => {
      table.increments('time_card_id').unique()
      table.integer('invoice_id').unsigned().references('invoice_id').inTable('Invoices')
      table.date('date')
      table.time('travel_time')
      table.timestamp('clock_in')
      table.time('lunch')
      table.timestamp('clock_out')
      table.string('notes')
    })
}

module.exports.down = (knex, Promise) => {
  //in reverse order
   knex.schema.dropTableIfExists('Time_Cards')
    .dropTableIfExists('Invoices')
    .dropTableIfExists('Estimates')
    .dropTableIfExists('Types_Of_Work')
}