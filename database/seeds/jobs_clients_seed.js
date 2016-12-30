'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Jobs_Clients').insert({
          'job_id': 7,
          'client_id': 21
        }),
        knex('Jobs_Clients').insert({
          'job_id': 7,
          'client_id': 22
        }),
        knex('Jobs_Clients').insert({
          'job_id': 9,
          'client_id': 21
        })
      ])  
    // });
}
