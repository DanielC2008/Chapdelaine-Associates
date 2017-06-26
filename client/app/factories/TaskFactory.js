'use strict'

app.factory('TaskFactory', function($http) {

  const factory = {}

  factory.getTasks = () => $http.get('/api/getTasks')

  return factory
})  