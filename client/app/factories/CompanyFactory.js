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

  factory.getFullCompanyById = company_id => $http.post('/api/getFullCompanyById', company_id)

  factory.updateExisting = dbPackage => $http.post('/api/updateCompany', dbPackage)

  factory.addNew = dbPackage => $http.post('/api/addNewCompany', dbPackage)

return factory

})