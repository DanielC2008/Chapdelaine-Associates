'use strict'

app.controller('Admin_Cancellations', function($scope, CancellationFactory, AlertFactory, FormFactory) {
  const ACA = this

  CancellationFactory.getCauses().then( ({data}) => ACA.causes = data).catch( err => console.log('err', err)) 

  ACA.addNew = () => {
    FormFactory.updateForm('Cancellations', null, {}, 'Add New').then( ({dbPackage}) => {
      CancellationFactory.addNew(dbPackage).then( ({msg}) => {
        $scope.setTabAndReload('ACA')
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

})