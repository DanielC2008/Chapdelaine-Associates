'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Types_Invoices').insert({
          'type_of_work_id': 21,
          'invoice_id': 18
        }),
        knex('Types_Invoices').insert({
          'type_of_work_id': 23,
          'invoice_id': 18
        }),
        knex('Types_Invoices').insert({
          'type_of_work_id': 25,
          'invoice_id': 18
        }),
        knex('Types_Invoices').insert({
          'type_of_work_id': 25,
          'invoice_id': 19
        })
      ])  
    // });
}
