
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Estimates').del()
    // .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Estimates').insert({
          'date_created': '2008-11-11',
          'notes': "test"
        }),
        knex('Estimates').insert({
          'date_created': '1972-11-11',
          'notes': "test2"
        }),
      ]);
    // });
};
