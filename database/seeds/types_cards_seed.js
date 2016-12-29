'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Types_Cards').insert({
          'type_of_work_id': 24,
          'time_card_id': 18
        }),
        knex('Types_Cards').insert({
          'type_of_work_id': 25,
          'time_card_id': 19
        }),
        knex('Types_Cards').insert({
          'type_of_work_id': 26,
          'time_card_id': 20
        })
      ])  
    // });
}
