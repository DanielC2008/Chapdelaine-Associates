'use strict'

app.factory('ClientFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

    factory.removeFromJob = dataObj => $http.post('/api/removeClientFromJob', dataObj)

    const getFullClientById = client_id => $http.post('/api/getFullClientById', client_id)

    const getFullClientOnJob = client_id => $http.post('/api/getFullClientOnJob', client_id)

    const getClientsForSearch = () => $http.get('/api/getClientsForSearch')

    factory.addClient = ids => {
      return new Promise ((resolve, reject) => {
        getClientsForSearch().then( ({data}) => {
          let clientNames = data
          SearchFactory.addBySearch(clientNames)
          .then( client_id => {
            ids.client_id = client_id
            if (client_id) { 
              // edit existing client
              getFullClientById({client_id: client_id}).then(({data}) => { 
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

  return factory
})