'use strict'

app.controller('JobEstimate', function($scope, JobFactory) {
  let JEScope = this

  $scope.DBObj = {
    table: 'Estimates',
    id: 'estimate_id',
    connectingTableId: 'types_estimates_id'
  }
  $scope.Details = $scope.EstimateDetails
  


})