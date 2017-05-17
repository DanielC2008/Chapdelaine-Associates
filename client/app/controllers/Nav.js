'use strict'

app.controller('Nav', function($scope, JobFactory, $mdDialog) {
  let NAV = this
  
  NAV.submit = jobNumber => {
    JobFactory.goToJobPage(jobNumber)
    NAV.jobNumber = ''
  }

  NAV.newJob = () =>{
    $mdDialog.show({
      controller: 'NewJob as NJ',
      templateUrl: '/partials/newJob.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    })
  }
})