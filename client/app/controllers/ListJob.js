'use strict'

app.controller('ListJob', function($scope, JobFactory) {
  let LJScope = this

  LJScope.goToJobPage = jobNumber => JobFactory.goToJobPage(jobNumber)

})