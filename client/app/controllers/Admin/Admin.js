'use strict'

app.controller('Admin', function($scope, AdminFactory, $route, ToastFactory) {

  let tab = AdminFactory.getTab()
  $scope.showTab = tab === '' ? 'MC' : tab 

  $scope.setTabAndReload = tab => {
    AdminFactory.setTab(tab)
    $route.reload()
    ToastFactory.toastSuccess()
  }

})