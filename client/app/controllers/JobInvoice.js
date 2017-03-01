'use strict'

app.controller('JobInvoice', function($scope, JobFactory) {
  let JIScope = this

  console.log('$scope.jobId', $scope.jobId)
  $scope.tableForRN = 'Invoices'

  $scope.numberSet = invoice_number => {
    console.log('invoice_number', invoice_number)
  }


})