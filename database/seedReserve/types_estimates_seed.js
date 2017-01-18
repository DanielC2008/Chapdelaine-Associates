'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Types_Estimates').insert({
          'type_of_work_id': 21,
          'estimate_id': 18
        }),
        knex('Types_Estimates').insert({
          'type_of_work_id': 23,
          'estimate_id': 18
        }),
        knex('Types_Estimates').insert({
          'type_of_work_id': 25,
          'estimate_id': 18
        }),
        knex('Types_Estimates').insert({
          'type_of_work_id': 25,
          'estimate_id': 19
        })
      ])  
    // });
}
