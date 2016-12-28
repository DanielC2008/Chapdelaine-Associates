
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Invoices').del()
    // .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Invoices').insert({
          'invoice_number': 1234
        }),
        knex('Invoices').insert({
         'invoice_number': 1235
        }),
      ]);
    // });
};
