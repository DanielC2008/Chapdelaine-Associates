'use strict'

app.controller('UpdateStatus', function($scope, jobInfo) { 
  let US = this
  $scope.tableForDB ='Jobs' //---------------for getMaxNumber on RN
  $scope.currentStatus = jobInfo.jobStatus  //---setting current status

})
