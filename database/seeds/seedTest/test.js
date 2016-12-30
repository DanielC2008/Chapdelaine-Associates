// save here until test suite developed 

//knex test
// Types_Estimates, Types_Invoices many to many
// knex('Types_Of_Work')
//   .select('*')
//   .join('Types_Invoices', 'Types_Of_Work.type_of_work_id', '=', 'Types_Invoices.type_of_work_id')
//   .join('Invoices', 'Types_Invoices.invoice_id', '=', 'Invoices.invoice_id')
//   .where('Invoices.invoice_id', 18)
//   .then( data => {
//       console.log('data', data);
//   })
// Types_Cards many to many
// knex('Types_Of_Work')
//   .select('*')
//   .join('Types_Cards', 'Types_Of_Work.type_of_work_id', '=', 'Types_Cards.type_of_work_id')
//   .join('Time_Cards', 'Types_Cards.time_card_id', '=', 'Time_Cards.time_card_id')
//   .join('Invoices', 'Time_Cards.invoice_id', '=', 'Invoices.invoice_id')
//   .where('Invoices.invoice_id', 15)
//   .then( data => {
//       console.log('data', data);
//   })


/* 
let now = new Date()

knex('Jobs').update({'last_accessed': now }).returning('*').then( data => {
  console.log('data', data);
})*/


// for jobs_properties and clients
// knex('Clients')
//   .select('*')
//   .join('Jobs_Clients', 'Clients.client_id', '=', 'Jobs_Clients.client_id')
//   .join('Jobs', 'Jobs_Clients.job_id', '=', 'Jobs.job_id')
//   .where('Jobs.job_id', 7)
//   .then( data => {
//       console.log('data', data);
//   })
// and vice versa
// knex('Jobs')
//   .select('*')
//   .join('Jobs_Clients', 'Jobs.job_id', '=', 'Jobs_Clients.job_id')
//   .join('Clients', 'Jobs_Clients.client_id', '=', 'Clients.client_id')
//   .where('Clients.client_id', 21)
//   .then( data => {
//       console.log('data', data);
//   })