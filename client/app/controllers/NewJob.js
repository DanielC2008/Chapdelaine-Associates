'use strict'

app.controller('NewJob', function($scope, JobFactory) { 
  let NJscope = this
  $scope.tableForDB ='Jobs' //---for getMaxNumber on RN
  $scope.currentStatus = 'New'  //---setting current status

})