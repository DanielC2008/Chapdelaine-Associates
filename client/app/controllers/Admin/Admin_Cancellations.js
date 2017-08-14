'use strict'

app.controller('Admin_Cancellations', function($scope, CancellationFactory, ToastFactory, DBFactory) {
const ACA = this

  CancellationFactory.getCauses().then( ({data}) => {
    ACA.causes = data
  }) 

  ACA.addNew = () => {
    CancellationFactory.addNewCause().then( ({dbPackage}) => {
      DBFactory.addNew(dbPackage).then( ({msg}) => {
        $scope.setTabAndReload('ACA')
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

})