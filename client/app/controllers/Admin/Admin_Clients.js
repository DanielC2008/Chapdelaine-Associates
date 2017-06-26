'use strict'

app.controller('Admin_Clients', function($scope, $route, ClientFactory, ToastFactory) {
  let AC = this
  
  let ids = {job_id: null}

  AC.addOrEdit = () => { 
    ClientFactory.addClient(ids).then( ({msg}) => {
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

})