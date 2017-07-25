'use strict'

app.factory('CustomerFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  const getCustomersForSearch = () => $http.get('/api/getCustomersForSearch')

  factory.searchForCustomers = () => {
    return new Promise ((resolve, reject) => {
      getCustomersForSearch().then( ({data}) => {
        let names = data
        SearchFactory.addBySearch(names).then( customer_id => {
          customer_id ? resolve(customer_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addCustomer = () => FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New')

  factory.editCustomer = (customer, id) => FormFactory.updateForm('Customers', customer, {customer_id: id}, 'Update')

  factory.getFullCustomerById = customer_id => $http.post('/api/getFullCustomerById', customer_id)

  // factory.addNewRep = ids => { //if job_id adds to Job otherwise just to DB
  //   return new Promise ((resolve, reject) => {
  //     FormFactory.updateForm('Representatives', null, ids, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
  //   })
  // }

  // factory.addExistingRepToJob = (ids, data) => { //only used to add existing to Job
  //   return new Promise ((resolve, reject) => { 
  //     FormFactory.updateForm('Representatives', data, ids, 'Add Existing').then( msg => resolve(msg)).catch(err => reject({msg:'Nothing Saved'}))
  //   })
  // }  

  // factory.updateExistingRep = (ids, data) => {
  //   return new Promise ((resolve, reject) => {
  //     FormFactory.updateForm('Representatives', data, ids, 'Update').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
  //   })
  // }   

  // factory.removeFromJob = ids => $http.post('/api/removeRepFromJob', {ids})


  return factory
})