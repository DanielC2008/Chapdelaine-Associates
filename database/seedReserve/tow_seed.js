'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Types_Of_Work').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Types_Of_Work').insert({
          'type_of_work': 'test1',
          'rate': '425',
          'hourly': false
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'test2',
          'rate': '450',
          'hourly': false
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'test3',
          'rate': '530',
          'hourly': false
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'test4',
          'rate': '7.90',
          'hourly': true
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'test5',
          'rate': '9.00',
          'hourly': true
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'test6',
          'rate': '7.25',
          'hourly': true
        })
      ]);
    // });
};
