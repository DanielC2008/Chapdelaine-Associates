'use strict'

app.factory('CompanyFactory', function($http, SearchFactory, AlertFactory) {

  const factory = {}

  const getCompaniesForSearch = () => $http.get('/api/getCompaniesForSearch')

  factory.searchForCompanies = (allowNew = true) => {
     AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getCompaniesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()
        let clientNames = data
        let formForNew = true
        SearchFactory.addBySearch(clientNames, allowNew, formForNew).then( client_id => {
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