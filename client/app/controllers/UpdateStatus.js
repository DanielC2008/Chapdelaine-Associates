'use strict'

app.controller('UpdateStatus', function($scope, jobInfo) { 
  let US = this
  $scope.jobInfo = jobInfo
  console.log('jobInfo', jobInfo)

})
