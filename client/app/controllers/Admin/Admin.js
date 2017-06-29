'use strict'

app.controller('Admin', function($scope, AdminFactory) {

  let tab = AdminFactory.getTab()
  $scope.showTab = tab === '' ? 'MC' : tab 

})