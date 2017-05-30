'use strict'

app.controller('UpdateStatus', function($scope, jobInfo) { 
  let US = this
  $scope.tableForDB ='Jobs' //---------------for getMaxNumber on RN
  $scope.jobInfo = jobInfo  //---setting current status

})
