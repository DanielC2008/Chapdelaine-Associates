'use strict'

app.controller('JobEstimate', function($scope, JobFactory) {
  let JEScope = this

  $scope.DBObj = {
    table: 'Estimates',
    id: 'estimate_id',
    connectingTableId: 'estimate_task_id'
  }
  $scope.Details = $scope.EstimateDetails
  


})