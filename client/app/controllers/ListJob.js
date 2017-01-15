'use strict'

app.controller('ListJob', function($scope, JobFactory) {
  let LJScope = this

  LJScope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)

})