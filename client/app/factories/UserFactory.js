'use strict'

app.factory('UserFactory', function($http, FormFactory) {
  const factory = {}

  factory.getUserName = () => $http.get('/api/getUserName')

  factory.removeUser = () => $http.get('/api/removeUser')

  factory.getAllEmployees = () => $http.get('/api/getAllEmployees')

  factory.addNew = dbPackage => $http.post('/api/addNewEmployee', dbPackage)

  factory.updateExisting = dbPackage => $http.post('/api/updateEmployee', dbPackage)

  factory.deleteEmployee = id => $http.post('/api/deleteEmployee', {id})

  return factory
})  