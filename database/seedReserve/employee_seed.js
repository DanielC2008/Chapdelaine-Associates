'use strict'

const knex = require('knex')

module.exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  // return knex('Employees').del()
  //   .then( () => {
      return Promise.all([
        // Inserts seed entries
        knex('Employees').insert({
          'user_id': 37,
          'first_name': 'test',
          'middle_name': 'test',
          'address': 'test',
          's_s_number': 'test',
          'date_of_birth': '1990-12-12',
          'marital_status': true,
          'u_s_citizen': true,
          'home_phone': 'test',
          'mobile_phone': 'test',
          'start_date': '2008-11-11',
          'end_date': '2012-11-11',
          'position': 'test',
          'pay_rate': 7.23
        }),
        knex('Employees').insert({
          'user_id': 36,
          'first_name': 'something_else',
          'middle_name': 'something_else',
          'address': 'something_else',
          's_s_number': 'something_else',
          'date_of_birth': '1990-12-12',
          'marital_status': true,
          'u_s_citizen': true,
          'home_phone': 'something_else',
          'mobile_phone': 'something_else',
          'start_date': '2008-11-11',
          'end_date': '2012-11-11',
          'position': 'something_else',
          'pay_rate': 7.23
        })
      ]);
    // });
};
