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

  factory.updateExistingCompany = (ids, data) => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Companies', data, ids, 'Update').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addNewCompany = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Companies', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

return factory

})