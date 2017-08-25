'use strict'

app.factory('CompanyFactory', function($http, SearchFactory, FormFactory, AlertFactory) {

  const factory = {}

  const getCompaniesForSearch = () => $http.get('/api/getCompaniesForSearch')

  factory.searchForCompanies = () => {
     AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getCompaniesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()
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