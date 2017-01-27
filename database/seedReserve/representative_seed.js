'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Representatives').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Representatives').insert({
          'client_id': 21,  
          'first_name': 'test',
          'middle_name': 'test',
          'last_name': 'test',
          'email': 'test',
          'business_phone': '16157998104',
          'mobile_phone': 'test',
          'home_phone': 'test',
          'fax_number': 'test',
          'address': 'test',
          'city': 'test',
          'state': 'test',
          'zip_code': 'test',
          'county': 'test',
          'notes': 'test'
        }),
        knex('Representatives').insert({
          'client_id': 22,         
          'first_name': 'test2',
          'middle_name': 'test2',
          'last_name': 'test2',
          'email': 'test2',
          'business_phone': 'test2',
          'mobile_phone': 'test2',
          'home_phone': 'test2',
          'fax_number': 'test2',
          'address': 'test2',
          'city': 'test2',
          'state': 'test2',
          'zip_code': 'test2',
          'county': 'test2',
          'notes': 'test2'
        }),
      ]);
    // });
};
