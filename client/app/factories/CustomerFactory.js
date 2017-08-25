'use strict'

app.factory('CustomerFactory', function($http, SearchFactory, FormFactory, AlertFactory) {

  const factory = {}

  const getCustomersForSearch = () => $http.get('/api/getCustomersForSearch')

  factory.searchForCustomers = (allowNew = true) => {
    return new Promise ((resolve, reject) => {
    AlertFactory.summonDisableForm()
      getCustomersForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()
        let names = data
        SearchFactory.addBySearch(names, allowNew).then( customer_id => {
          customer_id ? resolve(customer_id) : resolve(null)
        }).catch( err => console.log('err', err))
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addNew = dbPackage => $http.post('/api/addNewCustomer', dbPackage)

  factory.updateExisting = dbPackage => $http.post('/api/updateCustomer', dbPackage)

  factory.getFullCustomerById = customer_id => $http.post('/api/getFullCustomerById', customer_id)

  return factory
})