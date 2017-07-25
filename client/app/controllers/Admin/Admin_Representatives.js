'use strict'

app.controller('Admin_Representatives', function($scope, CustomerFactory, ToastFactory) {
  let AR = this

  AR.addOrEdit = () => { 
    let ids = { job_id: null}
    CustomerFactory.searchForReps().then( rep_id => {
      ids.representative_id = rep_id
      if (rep_id) {
        CustomerFactory.getFullRepById({ids}).then( ({data}) => {
          CustomerFactory.updateExistingRep(ids, data).then( ({msg}) => {
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        CustomerFactory.addNewRep(ids).then( ({msg}) => {
          ToastFactory.toastSuccess(msg)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 
})