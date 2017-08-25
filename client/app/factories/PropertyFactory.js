'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, FormFactory, AlertFactory) {

  const factory = {}

  const getAddressesForSearch = () => $http.get('/api/getAddressesForSearch')
  
  const getRoadsForSearch = () => $http.get('/api/getRoadsForSearch')

  factory.addNew = dbPackage => $http.post('/api/addNewPropertyToJob', dbPackage)

  factory.updateExisting = dbPackage => $http.post('/api/updateProperty', dbPackage)

  factory.getAddressesOnProp = property_id => $http.post('/api/getAddressesOnProp', {property_id})

  factory.addSecondaryAddress = dbPackage => $http.post('/api/addSecondaryAddress', dbPackage)
  
  factory.removeSecondaryAddress = dbPackage => $http.post('/api/removeSecondaryAddress', dbPackage)

  factory.searchForAddresses = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getAddressesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()
        let addresses = data
        SearchFactory.addBySearch(addresses, allowNew).then( selected => {
          selected ? resolve(selected) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.getRoadsOnProp = property_id => $http.post('/api/getRoadsOnProp', {property_id})

  factory.addSecondaryRoad = dbPackage => $http.post('/api/addSecondaryRoad', dbPackage)

  factory.removeSecondaryRoad = dbPackage => $http.post('/api/removeSecondaryRoad', dbPackage)

  factory.searchForRoads = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getRoadsForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let roads = data
        SearchFactory.addBySearch(roads, allowNew).then( road_id => {
          road_id ? resolve(road_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  return factory
})