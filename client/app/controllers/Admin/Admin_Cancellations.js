'use strict'

app.controller('Admin_Cancellations', function($scope, CancellationFactory, AdminFactory, ToastFactory, $route, DBFactory) {
const ACA = this

CancellationFactory.getCauses().then( ({data}) => {
  ACA.causes = data
}) 

ACA.addNew = () => {
  CancellationFactory.addNewCause().then( ({dbPackage}) => {
    DBFactory.addNew(dbPackage).then( ({msg}) => {
      ////////////////////////////////////////////////////////////////can move this out to Admin.js
      AdminFactory.setTab('ACA')//////////////////////////////
      $route.reload()////////////////////////////////////
      ToastFactory.toastSuccess(msg)/////////////////////////////////
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
}

})