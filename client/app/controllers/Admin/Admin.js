'use strict'

app.controller('Admin', function($scope, UserFactory) {

  let tab = UserFactory.getTab()
  $scope.showTab = tab === '' ? 'MC' : tab 

})