'use strict'

app.factory('RepFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

    factory.removeFromJob = dataObj => $http.post('/api/removeRepFromJob', dataObj)

    const getFullRepById = rep_id => $http.post('/api/getFullRepById', rep_id)

    const getRepsForSearch = () => $http.get('/api/getRepsForSearch')

    factory.addRep = (ids, clients) => { 
      return new Promise ((resolve, reject) => {
        //force to pick a client for rep to represent
        SearchFactory.chooseOne('Clients', clients).then( client_id => {
          ids.client_id = client_id
          getRepsForSearch().then( ({data}) => {
            let repsNames = data
            SearchFactory.addBySearch(repsNames).then( rep_id => {
              ids.representative_id = rep_id
              if (rep_id) { 
                // edit existing rep
                getFullRepById({ids}).then(({data}) => { 
                  FormFactory.updateForm('Representatives', data, ids, 'Add Existing').then( msg => {
                    resolve(msg)
                  }).catch( err => reject(err))
                }).catch( err => reject(err))
              } else {
                //add new rep
                FormFactory.updateForm('Representatives', null, ids, 'Add New').then( msg => {
                  resolve(msg)
                }).catch( err => reject(err))
              }
            }).catch( err => reject(err))
          }).catch( () => reject({msg:'Nothing Saved'})) 
        })
      })
    }

    factory.editRep = (ids , reps) => {
      return new Promise ((resolve, reject) => {
        SearchFactory.chooseOne('Representatives', reps).then( rep_id => {
          ids.representative_id = rep_id
          getFullRepById({ids}).then( ({data}) => {
            FormFactory.updateForm('Representatives', data, ids, 'Update').then( msg => {
              resolve(msg)
            }).catch( err => reject({msg:'Nothing Saved'}))
          }).catch( err => console.log('err', err))
        }).catch( err => reject({msg:'Nothing Saved'}))
      })
    }

  factory.removeRep = (ids, reps) => {
    return new Promise ((resolve, reject) => {
      SearchFactory.chooseOne('Representatives', reps).then( rep_id => {
        ids.representative_id = rep_id
        $http.post('/api/removeRepFromJob', {ids}).then( ({data: {msg}}) => {
          resolve(msg)
        }).catch( err => console.log('err', err))
      }).catch( err => reject({msg:'Nothing Saved'}))
    })  
  }  

  return factory
})