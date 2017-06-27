'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  factory.addProperty = ids => FormFactory.updateForm('Properties', null, ids, 'Add New')

  factory.editProperty = (ids , property) => FormFactory.updateForm('Properties', property, ids, 'Update')

  return factory
})