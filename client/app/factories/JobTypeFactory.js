'use strict'

app.factory('JobTypeFactory', function($http) {

  const factory = {}

  factory.addJobTypeToJob = dbPackage => $http.post('/api/addJobTypeToJob', dbPackage)

  factory.addNew = dbPackage => $http.post('/api/addNewJobType', dbPackage)
  
  factory.removeJobTypeFromJob = dbPackage => $http.post('/api/removeJobTypeFromJob', dbPackage)

  factory.disableJobType = id => $http.post('/api/disableJobType', {id})

  factory.reprioritizeJobTypes = dbPackage => $http.post('/api/reprioritizeJobTypes', {dbPackage})

  factory.getJobTypeNames = () => jobTypesObj
  
  factory.getEnabledJobTypes = () => $http.get('/api/getEnabledJobTypes')

  factory.getAllJobTypes = () => $http.get('/api/getAllJobTypes')

  return factory
})