'use strict'

app.factory('UserFactory', function($http, FormFactory) {

  const factory = {}

  factory.getUserName = () => $http.get('/api/getUserName')

  factory.removeUser = () => $http.get('/api/removeUser')

  factory.getAllEmployees = () => $http.get('/api/getAllEmployees')

  factory.addNew = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Employees', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  return factory
})  