'use strict'

const knex = require('knex')

module.exports.up = (knex, Promise) => {
  return knex.schema.alterTable('Users', table => {
    table.unique("user_id")
  }).alterTable('Employees', table => {
    table.unique("employee_id")
  }).alterTable('Properties', table => {
    table.unique("property_id")
  }).alterTable('Jobs', table => {
    table.unique("job_id")
  })
}

module.exports.down = (knex, Promise) => {
  return knex.schema.alterTable('Users', table => {
    table.dropUnique("user_id")
  }).alterTable('Employees', table => {
    table.dropUnique("employee_id")
  }).alterTable('Properties', table => {
    table.dropUnique("property_id")
  }).alterTable('Jobs', table => {
    table.dropUnique("job_id")
  })
}