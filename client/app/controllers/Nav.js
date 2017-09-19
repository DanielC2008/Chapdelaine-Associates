'use strict'

app.controller('Nav', function($scope, JobFactory, $mdDialog, AlertFactory) {
  let NAV = this

  NAV.submit = jobNumber => {
    JobFactory.checkJobNumberExists(jobNumber).then( ({ data: { exists } }) => {
      if (exists) {
        JobFactory.goToJobPage(jobNumber)
        NAV.jobNumber = ''        
      } else {
        AlertFactory.toastReject(`Job Number ${jobNumber} doesn't exist!`)
      }
    }).catch( err => console.log('err', err))
  }

  NAV.newJob = () =>{
    let locals = {
      job: null
    }
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'JobForm',
      templateUrl: '/partials/jobForm.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      escapeToClose: false,
      multiple: true
    })
    .then( jobNumber => {
      if (jobNumber) {
        JobFactory.goToJobPage(jobNumber)
      }  
    })
    .catch( err => console.log('err', err))
  }
})