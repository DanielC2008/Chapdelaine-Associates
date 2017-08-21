'use strict'

app.factory('TaskFactory', function($q, $http) {

  const factory = {}

  factory.addNew = dbPackage => $http.post('/api/addNewTask', dbPackage)

  factory.updateExisting = (dbObj, ids) => $http.post('/api/updateTask', {dbObj, ids})

  factory.disableTask = id => $http.post('/api/disableTask', {id})

  factory.getTaskNames = () => taskObj

  factory.getAllTasks = () => $http.get('/api/getAllTasks')

  factory.getEnabledTasks = () => $http.get('/api/getEnabledTasks')

  return factory
})  