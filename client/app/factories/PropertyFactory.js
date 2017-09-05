'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, AlertFactory) {

  const factory = {}

////////////////////////////////////////PROPERTY//////////////////////////////////////////////
  factory.addNew = dbPackage => $http.post('/api/addNewPropertyToJob', dbPackage)

  factory.updateExisting = dbPackage => $http.post('/api/updateProperty', dbPackage)

////////////////////////////////////////ADDRESS//////////////////////////////////////////////
  const getAddressesForSearch = () => $http.get('/api/getAddressesForSearch')
  
  factory.getAddressesOnProp = property_id => $http.post('/api/getAddressesOnProp', {property_id})

  factory.addSecondaryAddress = dbPackage => $http.post('/api/addSecondaryAddress', dbPackage)
  
  factory.removeSecondaryAddress = dbPackage => $http.post('/api/removeSecondaryAddress', dbPackage)

  factory.searchForAddresses = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getAddressesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()
        let addresses = data
        let formForNew = false
        SearchFactory.addBySearch(addresses, allowNew, formForNew).then( selected => {
          selected ? resolve(selected) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

////////////////////////////////////////ROAD//////////////////////////////////////////////
  const getRoadsForSearch = () => $http.get('/api/getRoadsForSearch')

  factory.getRoadsOnProp = property_id => $http.post('/api/getRoadsOnProp', {property_id})

  factory.addSecondaryRoad = dbPackage => $http.post('/api/addSecondaryRoad', dbPackage)

  factory.removeSecondaryRoad = dbPackage => $http.post('/api/removeSecondaryRoad', dbPackage)

  factory.searchForRoads = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getRoadsForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let roads = data
        let formForNew = false
        SearchFactory.addBySearch(roads, allowNew, formForNew).then( road_id => {
          road_id ? resolve(road_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }
////////////////////////////////////////CITY//////////////////////////////////////////////
  const getCitiesForSearch = () => $http.get('/api/getCitiesForSearch')

  factory.searchForCities = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getCitiesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let cities = data
        let formForNew = false
        SearchFactory.addBySearch(cities, allowNew, formForNew).then( city_id => {
          city_id ? resolve(city_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

////////////////////////////////////////STATE//////////////////////////////////////////////
  const getStatesForSearch = () => $http.get('/api/getStatesForSearch')

  factory.searchForStates = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getStatesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let states = data
        let formForNew = false
        SearchFactory.addBySearch(states, allowNew, formForNew).then( state_id => {
          state_id ? resolve(state_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

////////////////////////////////////////ZIP CODE//////////////////////////////////////////////
  const getZipCodesForSearch = () => $http.get('/api/getZipCodesForSearch')

  factory.searchForZipCodes = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getZipCodesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let zipCodes = data
        let formForNew = false
        SearchFactory.addBySearch(zipCodes, allowNew, formForNew).then( zip_code_id => {
          zip_code_id ? resolve(zip_code_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

////////////////////////////////////////COUNTY//////////////////////////////////////////////  
  const getCountiesForSearch = () => $http.get('/api/getCountiesForSearch')
  

  factory.searchForCounties = (allowNew = true) => {
    AlertFactory.summonDisableForm()
    return new Promise ((resolve, reject) => {
      getCountiesForSearch().then( ({data}) => {
        AlertFactory.banishDisableForm()        
        let counties = data
        let formForNew = false
        SearchFactory.addBySearch(counties, allowNew, formForNew).then( county_id => {
          county_id ? resolve(county_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }


  return factory
})