'use strict'

app.controller('JobInvoice', function($scope, JobFactory) {
  let JIScope = this

  if ($scope.InvoiceDetails.length === 0){ //////data has returned. take user selected number and create the invoice on the job_id
    // JIScope.invoice = false
    // JobFactory.getMaxNumber({table:'Invoices'})
    // .then( ({data: {max}}) => {
    //   $scope.recommended = max + 1 
    // })
    // .catch( ({data}) => console.log(data))
  } else {
    JIScope.invoice = true
  }


  // JIScope.addNumber = number => {
  //   let objToAdd. = {
  //     job_id: $scope.jobId

  //   } 
  // }



})