'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  factory.addProp = () => FormFactory.updateForm('Properties', null, {}, 'Add New')

  factory.editProp = property => FormFactory.updateForm('Properties', property, {}, 'Update')

  factory.getAddressesOnProp = property_id => $http.post('/api/getAddressesOnProp', {property_id})
  
  factory.getRoadsOnProp = property_id => $http.post('/api/getRoadsOnProp', {property_id})

  factory.addAddress = () => FormFactory.updateForm('Addresses', null,  {}, 'Add New')

  const getAddressesForSearch = () => $http.get('/api/getAddressesForSearch')

  factory.searchForAddresses = () => {
    return new Promise ((resolve, reject) => {
      getAddressesForSearch().then( ({data}) => {
        let addresses = data
        SearchFactory.addBySearch(addresses).then( selected => {
          selected ? resolve(selected) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addRoad = () => FormFactory.updateForm('Roads', null,  {}, 'Add New')

  const getRoadsForSearch = () => $http.get('/api/getRoadsForSearch')

  factory.searchForRoads = () => {
    return new Promise ((resolve, reject) => {
      getRoadsForSearch().then( ({data}) => {
        let roads = data
        SearchFactory.addBySearch(roads).then( road_id => {
          road_id ? resolve(road_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }




  return factory
})