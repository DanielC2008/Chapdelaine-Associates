
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('is_Table_Searchable').del()
  //   .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('is_Table_Searchable').insert({
          table_name: 'Employees',
          find_job: false,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Properties',
          find_job: true,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Clients',
          find_job: true,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Representatives',
          find_job: true,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Types_Of_Work',
          find_job: false,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Estimates',
          find_job: false,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Invoices',
          find_job: false,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Time_Cards',
          find_job: false,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Jobs',
          find_job: true,
          get_data: true,
        }),
        knex('is_Table_Searchable').insert({
          table_name: 'Attachments',
          find_job: false,
          get_data: true,
        }),
      ])
    // });
};
