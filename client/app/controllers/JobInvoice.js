'use strict'

app.controller('JobInvoice', function($scope, JobFactory) {
  let JIScope = this

  $scope.tableForRN = 'Invoices'

  $scope.numberSet = invoice_number => {
    //send to database and update
   $scope.Invoice.invoice_number = invoice_number
  }


})