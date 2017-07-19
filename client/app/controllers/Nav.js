'use strict'

app.controller('Nav', function($scope, JobFactory, $mdDialog) {
  let NAV = this
  
  NAV.submit = jobNumber => {
    JobFactory.goToJobPage(jobNumber)
    NAV.jobNumber = ''
  }

  NAV.newJob = () =>{
    let locals = {}
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'JobForm as JF',
      templateUrl: '/partials/jobForm.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
  }
})