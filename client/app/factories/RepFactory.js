'use strict'

app.factory('RepFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  const getRepsForSearch = () => $http.get('/api/getRepsForSearch')

  factory.searchForReps = () => {
    return new Promise ((resolve, reject) => {
      getRepsForSearch().then( ({data}) => {
        let repNames = data
        SearchFactory.addBySearch(repNames).then( rep_id => {
          rep_id ? resolve(rep_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addNewRep = ids => { //if job_id adds to Job otherwise just to DB
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Representatives', null, ids, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addExistingRepToJob = (ids, data) => { //only used to add existing to Job
    return new Promise ((resolve, reject) => { 
      FormFactory.updateForm('Representatives', data, ids, 'Add Existing').then( msg => resolve(msg)).catch(err => reject({msg:'Nothing Saved'}))
    })
  }  

  factory.updateExistingRep = (ids, data) => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Representatives', data, ids, 'Update').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }   

  factory.removeFromJob = ids => $http.post('/api/removeRepFromJob', {ids})

  factory.getFullRepById = rep_id => $http.post('/api/getFullRepById', rep_id)

  return factory
})