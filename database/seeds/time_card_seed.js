'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Time_Cards').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Time_Cards').insert({
          'invoice_id': 18,
          'date': '2004-12-23',
          'travel_time': '12:24AM',
          'notes': 'something special'
        }),
        knex('Time_Cards').insert({
         'invoice_id': 18,
         'date': '2004-12-23',
         'travel_time': '12:24AM',
         'notes': 'something special'
        }),
        knex('Time_Cards').insert({
         'invoice_id': 18,
         'date': '2004-12-23',
         'travel_time': '12:24AM',
         'notes': 'something special'
        })
      ]);
    // });
};
