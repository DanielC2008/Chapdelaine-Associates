'use strict'

app.controller('Admin_Clients', function($scope, $route, ClientFactory, ToastFactory) {
  let AC = this

  AC.addOrEdit = () => { 
    let ids = { job_id: null}
    ClientFactory.searchForClients().then( client_id => {
      ids.client_id = client_id
      if (client_id) {
        ClientFactory.getFullClientById({ids}).then( ({data}) => {
          ClientFactory.updateExistingClient(ids, data).then( ({msg}) => {
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        ClientFactory.addNewClient(ids).then( ({msg}) => {
          ToastFactory.toastSuccess(msg)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    })
  } 

})