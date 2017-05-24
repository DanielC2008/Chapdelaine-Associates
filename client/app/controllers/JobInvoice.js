'use strict'

app.controller('JobInvoice', function($scope, JobFactory) {
  let JIScope = this

  $scope.tableForDB = 'Invoices'

  $scope.DBObj = {
    table: 'Invoices',
    id: 'invoice_id',
    connectingTableId: 'invoice_task_id'
  }

  $scope.Details = $scope.InvoiceDetails

  $scope.numberSet = invoice_number => {
    let updateObj = {
      table: 'Invoices',
      idObj: {invoice_id: $scope.Invoices.invoice_id},
      columnsToUpdate: {invoice_number: invoice_number}
    }
    JobFactory.updateTable(updateObj)
    .then(() => $scope.Invoices.invoice_number = invoice_number)
    .catch( ({data}) => console.log('data', data))
  }


})