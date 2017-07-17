'use strict'

app.controller('Admin_Cancellations', function($scope, CancellationFactory, AdminFactory, ToastFactory, $route) {
const ACA = this

CancellationFactory.getCauses().then( ({data}) => {
  ACA.causes = data
}) 

ACA.addNew = () => {
    CancellationFactory.addNewCause().then( ({msg}) => {
      ////////////////////////////////////////////////////////////////can move this out to Admin.js
      AdminFactory.setTab('ACA')//////////////////////////////
      $route.reload()////////////////////////////////////
      ToastFactory.toastSuccess(msg)/////////////////////////////////
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
})