'use strict'

app.factory('FindJobFactory', function($http) {

  const factory = {}

  factory.customerConnectTable = dbObj => $http.post('/api/customerConnectTable', dbObj)

  factory.customerForeignKey = dbObj => $http.post('/api/customerForeignKey', dbObj)
  
  factory.customerRegColumn = dbObj => $http.post('/api/customerRegColumn', dbObj)
  
  factory.propertyConnectTable = dbObj => $http.post('/api/propertyConnectTable', dbObj)
  
  factory.propertyForeignKey = dbObj => $http.post('/api/propertyForeignKey', dbObj)
  
  factory.propertyRegColumn = dbObj => $http.post('/api/propertyRegColumn', dbObj)

  factory.searchForJobStatus = dbObj => $http.post('/api/searchForJobStatus', dbObj)

  factory.searchForJobType = dbObj => $http.post('/api/searchForJobType', dbObj)
  
  factory.searchForTasks = dbObj => $http.post('/api/searchForTasks', dbObj)


  return factory

})
