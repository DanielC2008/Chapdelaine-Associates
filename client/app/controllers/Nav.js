'use strict'

app.controller('Nav', function($scope, JobFactory) {
  let NAV = this
  
  NAV.submit = jobNumber => {
    JobFactory.goToJobPage(jobNumber)
    NAV.jobNumber = ''
  }
})