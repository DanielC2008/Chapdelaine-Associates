'use strict'

app.controller('ListJob', function($scope, $location) {
  let LJScope = this

  LJScope.getJob = jobNumber => {
    $location.path(`/jobs/:${jobNumber}`)
  }

})