'use strict'

const knex = require('knex')
//delete first so we know exactly what is in the database 
module.exports.seed = function(knex, Promise) {
    return Promise.all([
      //delete tables with refereces first
      knex('Jobs_Clients').del(),
      knex('Jobs_Properties').del(),
      knex('Jobs').whereNotIn('job_id', [7,8,9]).del(),
      knex('Types_Cards').del(),
      knex('Types_Invoices').del(),
      knex('Types_Estimates').del(),
      knex('Time_Cards').whereNotIn('time_card_id', [18, 19, 20]).del(),
      knex('Invoices').whereNotIn('invoice_id', [15, 18, 19, 20]).del(),
      knex('Estimates').whereNotIn('estimate_id', [18, 19, 20]).del(),
      knex('Types_Of_Work').whereNotIn('type_of_work_id', [21, 23, 24, 25, 26]).del(),
      knex('Clients').whereNotIn('client_id', [21, 22]).del(),      
      knex('Employees').whereNotIn('employee_id', [126, 127]).del(),    
      knex('Representatives').whereNotIn('representative_id', [45, 46]).del(),
      knex('Properties').whereNotIn('property_id', [67, 68]).del()
    ])
};
