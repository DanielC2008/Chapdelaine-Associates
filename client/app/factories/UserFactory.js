'use strict'

app.factory('UserFactory', function($http) {

  const factory = {}

  factory.getUserName = () => $http.get('/api/getUserName')

  factory.removeUser = () => $http.get('/api/removeUser')

  return factory
})  