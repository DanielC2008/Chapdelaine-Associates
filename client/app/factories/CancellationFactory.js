'use strict'

app.factory('CancellationFactory', function($http, FormFactory) {

  const factory = {}

  factory.getCauses = () => $http.get('api/getCauses')

  factory.addNew = dbPackage => $http.post('/api/addNewCause', dbPackage)

  return factory
})
