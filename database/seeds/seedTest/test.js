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