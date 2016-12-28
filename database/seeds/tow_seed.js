
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('Types_Of_Work').del()
    // .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Types_Of_Work').insert({
          'type_of_work': 'TOPO',
          'rate': 425,
          'hourly': false
        }),
        knex('Types_Of_Work').insert({
          'type_of_work': 'Field',
          'rate': 7.25,
          'hourly': true
        }),
      ]);
    // });
};
