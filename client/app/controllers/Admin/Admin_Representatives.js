'use strict'

app.controller('Admin_Representatives', function($scope, RepFactory, ToastFactory) {
  let AR = this

  AR.addOrEdit = () => { 
    let ids = { job_id: null}
    RepFactory.searchForReps().then( rep_id => {
      ids.representative_id = rep_id
      if (rep_id) {
        RepFactory.getFullRepById({ids}).then( ({data}) => {
          RepFactory.updateExistingRep(ids, data).then( ({msg}) => {
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        RepFactory.addNewRep(ids).then( ({msg}) => {
          ToastFactory.toastSuccess(msg)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 
})