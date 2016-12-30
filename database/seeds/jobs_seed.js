'use strict'

const knex = require('knex')

module.exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Jobs').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Jobs').insert({
          'invoice_id': 18,  
          'estimate_id': 18,  
          'user_id': 37,
          'created_at': new Date(),
          'updated_at': new Date(), 
          'job_number': 1124,
          'start_date': '2016-12-01'
        }),
        knex('Jobs').insert({
          'invoice_id': 19,  
          'estimate_id': 19,  
          'user_id': 37,  
          'created_at': new Date(),
          'updated_at': new Date(),       
          'job_number': 1125,
          'start_date': '2016-12-01',
          'job_status': 'Active'         
        }),
        knex('Jobs').insert({
          'invoice_id': 20,  
          'estimate_id': 20,  
          'user_id': 36,
          'created_at': new Date(),
          'updated_at': new Date(),      
          'job_number': 5000,
          'start_date': '2012-12-01',
          'complete_date': '2016-12-01',
          'job_status': 'Complete'         
        })
      ]);
    // });
};
