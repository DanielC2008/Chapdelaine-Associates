'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.createTable('Employees', table => {
    table.increments('employee_id')
    table.integer('user_id').unsigned().references('user_id').inTable('Users')
    table.string('first_name')
    table.string('middle_name')
    table.string('address')
    table.string('s_s_number')
    table.date('date_of_birth')
    table.boolean('marital_status')
    table.boolean('u_s_citizen')
    table.string('home_phone')
    table.string('mobile_phone')
    table.date('start_date')
    table.date('end_date')
    table.string('position')
    table.integer('pay_rate')
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('Employees')
}