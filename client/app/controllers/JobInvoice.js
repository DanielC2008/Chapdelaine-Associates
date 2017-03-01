'use strict'

app.controller('JobInvoice', function($scope, JobFactory) {
  let JIScope = this

  $scope.tableForRN = 'Invoices'

  $scope.numberSet = invoice_number => {
    let updateObj = {
      table: 'Invoices',
      idObj: {invoice_id: $scope.Invoice.invoice_id},
      columnsToUpdate: {invoice_number: invoice_number}
    }
    JobFactory.updateTable(updateObj)
    .then(() => $scope.Invoice.invoice_number = invoice_number)
    .catch( ({data}) => console.log('data', data))
  }


})