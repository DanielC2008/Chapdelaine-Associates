'use strict'

app.factory('ClientFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  const getFullClientById = client_id => $http.post('/api/getFullClientById', client_id)

  const getFullClientOnJob = client_id => $http.post('/api/getFullClientOnJob', client_id)

  const getClientsForSearch = () => $http.get('/api/getClientsForSearch')

  factory.addClient = ids => {
    return new Promise ((resolve, reject) => {
      getClientsForSearch().then( ({data}) => {
        let clientNames = data
        SearchFactory.addBySearch(clientNames).then( client_id => {
          ids.client_id = client_id
          if (client_id) { 
            // edit existing client
            getFullClientById({ids}).then(({data}) => { 
              FormFactory.updateForm('Clients', data, ids, false).then( msg => {
                resolve(msg)
              }).catch( err => reject(err))
            }).catch( err => reject(err))
          } else {
            //add new client
            FormFactory.updateForm('Clients', null, ids, false).then( msg => {
              resolve(msg)
            }).catch( err => reject(err))
          }
        }).catch( err => reject(err))
      }).catch( () => reject({msg:'Nothing Saved'})) 
    })
  }

  factory.editClient = (ids , clients) => {
    return new Promise ((resolve, reject) => {
      SearchFactory.chooseOne('Clients', clients).then( client_id => {
        ids.client_id = client_id
        getFullClientOnJob({ids}).then( ({data}) => {
          FormFactory.updateForm('Clients', data, ids, true).then( msg => {
            resolve(msg)
          }).catch( err => reject({msg:'Nothing Saved'}))
        }).catch( err => console.log('err', err))
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.removeClient = (ids, clients) => {
    return new Promise ((resolve, reject) => {
      SearchFactory.chooseOne('Clients', clients).then( client_id => {
        ids.client_id = client_id
        $http.post('/api/removeClientFromJob', {ids}).then( msg => {
          resolve(msg)
        }).catch( err => console.log('err', err))
      }).catch( err => reject({msg:'Nothing Saved'}))
    })  
  }  

  return factory
})