'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Jobs_Properties').insert({
          'job_id': 7,
          'property_id': 67
        }),
        knex('Jobs_Properties').insert({
          'job_id': 8,
          'property_id': 68
        }),
        knex('Jobs_Properties').insert({
          'job_id': 9,
          'property_id': 67
        })
      ])  
    // });
}
