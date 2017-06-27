'use strict'

app.factory('ClientFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  const getClientsForSearch = () => $http.get('/api/getClientsForSearch')

  factory.searchForClients = () => {
    return new Promise ((resolve, reject) => {
      getClientsForSearch().then( ({data}) => {
        let clientNames = data
        SearchFactory.addBySearch(clientNames).then( client_id => {
          client_id ? resolve(client_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addNewClient = ids => { //if job_id adds to Job otherwise just to DB
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Clients', null, ids, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addExistingClientToJob = (ids, data) => { //only used to add existing to Job
    return new Promise ((resolve, reject) => { 
      FormFactory.updateForm('Clients', data, ids, 'Add Existing').then( msg => resolve(msg)).catch(err => reject({msg:'Nothing Saved'}))
    })
  }  

  factory.updateExistingClient = (ids, data) => { //if job_id updates to Job(main/client_id)otherwise just updates Client
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Clients', data, ids, 'Update').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  } 


  factory.removeClientFromJob = ids => { //removes client from connect table, does not delete from DB
    return new Promise ((resolve, reject) => {
      $http.post('/api/removeClientFromJob', {ids}).then( ({data: {msg}}) => {
        resolve(msg)
      }).catch( err => console.log('err', err))
    })
  }  

  factory.getFullClientById = client_id => $http.post('/api/getFullClientById', client_id)

  factory.getFullClientOnJob = client_id => $http.post('/api/getFullClientOnJob', client_id)

  return factory
})