'use strict'

app.controller('Admin_Job_Types', function($scope, JobFactory) {
  let JT = this

  JobFactory.getAllJobTypes().then( ({data}) => JT.Types = data)



})