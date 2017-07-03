'use strict'

app.controller('Admin_Job_Types', function($scope, JobFactory, ToastFactory, AdminFactory, $route) {
  let JT = this

  JobFactory.getAllJobTypes().then( ({data}) => JT.Types = data)

  JT.addNew = () => {
    JobFactory.addNewJobType().then( ({msg}) => {
      AdminFactory.setTab('JT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

})