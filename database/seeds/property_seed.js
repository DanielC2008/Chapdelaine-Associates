'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Properties').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Properties').insert({
          'address': 'test',
          'city': 'test',
          'state': 'test',
          'zip_code': 'test',
          'county': 'test',
          'map': 'test',
          'parcel_number': 'test',
          'deed_book': 'test',
          'page': 'test',
          'plat_book': 'test',
          'sub_division': 'test',
          'notes': 'test'
        }),
        knex('Properties').insert({
          'address': 'test2',
          'city': 'test2',
          'state': 'test2',
          'zip_code': 'test2',
          'county': 'test2',
          'map': 'test2',
          'parcel_number': 'test2',
          'deed_book': 'test2',
          'page': 'test2',
          'plat_book': 'test2',
          'sub_division': 'test2',
          'notes': 'test2'
        }),
      ]);
    // });
};
