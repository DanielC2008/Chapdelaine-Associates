'use strict'

app.factory('TaskFactory', function($http) {

  const factory = {}

  factory.getAllTasks = () => $http.get('/api/getAllTasks')

  return factory
})  