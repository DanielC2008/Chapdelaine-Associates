'use strict'

app.controller('UpdateStatus', function($scope, job_info) { 
  let US = this
  $scope.tableForDB ='Jobs' //---------------for getMaxNumber on RN
  $scope.job_info = job_info  //---setting current status

})
