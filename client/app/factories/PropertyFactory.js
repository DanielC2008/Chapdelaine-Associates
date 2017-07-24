'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  factory.addProperty = ids => FormFactory.updateForm('Properties', null, ids, 'Add New')

  factory.editProperty = (ids , property) => FormFactory.updateForm('Properties', property, ids, 'Update')

  factory.getAddressesOnProp = property_id => $http.post('/api/getAddressesOnProp', {property_id})
  
  factory.getRoadsOnProp = property_id => $http.post('/api/getRoadsOnProp', {property_id})

  factory.addAddressRoad = ids => FormFactory.updateForm('AddressRoad', {}, ids, 'Add New')

  return factory
})