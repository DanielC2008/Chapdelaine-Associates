'use strict'

app.factory('CompanyFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}


  const getCompaniesForSearch = () => $http.get('/api/getCompaniesForSearch')

  factory.searchForCompanies = () => {
    return new Promise ((resolve, reject) => {
      getCompaniesForSearch().then( ({data}) => {
        let clientNames = data
        SearchFactory.addBySearch(clientNames).then( client_id => {
          client_id ? resolve(client_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.getFullCompanyById = () => {}

  factory.updateExistingClient = () => {}

  factory.addNewClient = () => {}

return factory

})