'use strict'

app.factory('PropertyFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

    factory.removeFromJob = dataObj => $http.post('/api/removeClientFromJob', dataObj)

    factory.addProperty = ids => {
      return new Promise ((resolve, reject) => {
        FormFactory.updateForm('Properties', null, ids, false).then( msg => {
          resolve(msg)
        }).catch( err => reject(err))
      })
    }

    factory.editProperty = (ids , property) => {
      return new Promise ((resolve, reject) => {
        FormFactory.updateForm('Properties', property, ids, true).then( msg => {
          resolve(msg)
        }).catch( err => reject({msg:'Nothing Saved'}))
      })
    }

  return factory
})