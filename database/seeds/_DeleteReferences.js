'use strict'

const knex = require('knex')
//delete references if reseeding 
module.exports.seed = function(knex, Promise) {
    return Promise.all([
        knex('Types_Cards').del(),
        knex('Types_Invoices').del(),
        knex('Types_Estimates').del(),
        knex('Representatives').del(),
        knex('Properties').del()
    ])
};
