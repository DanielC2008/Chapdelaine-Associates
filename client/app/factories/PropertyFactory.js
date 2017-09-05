'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, AlertFactory, DBFactory) {

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
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { address: selected.value}
            DBFactory.insertSimple({table: 'Addresses', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }
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
        SearchFactory.addBySearch(roads, allowNew, formForNew).then( selected => {
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { road: selected.value}
            DBFactory.insertSimple({table: 'Roads', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }
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
        SearchFactory.addBySearch(cities, allowNew, formForNew).then( selected => {
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { city: selected.value}
            DBFactory.insertSimple({table: 'Cities', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }
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
        SearchFactory.addBySearch(states, allowNew, formForNew).then( selected => {
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { state: selected.value}
            DBFactory.insertSimple({table: 'States', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }
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
        SearchFactory.addBySearch(zipCodes, allowNew, formForNew).then( selected => {
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { zip_code: selected.value}
            DBFactory.insertSimple({table: 'Zip_Codes', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }        })
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
        SearchFactory.addBySearch(counties, allowNew, formForNew).then( selected => {
          if (selected.id) {
            resolve(selected)
          } else {
            // save new then update form
            let dbObj = { county: selected.value}
            DBFactory.insertSimple({table: 'Counties', dbObj}).then( () => resolve(selected))
            .catch(err => console.log('err', err))
          }        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }


  return factory
})