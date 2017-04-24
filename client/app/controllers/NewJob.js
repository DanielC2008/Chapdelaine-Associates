'use strict'

app.controller('NewJob', function($scope, JobFactory, $mdDialog) { 
  let NJscope = this
  
  $scope.tableForDB ='Jobs'
  $scope.Job = {}

  $scope.submitJobStatus = () => {
    JobFactory.createNewJob($scope.Job)
      .then( ({data}) =>  data.msg ? JobFactory.toastReject(data.msg) : ( $mdDialog.hide() && JobFactory.goToJobPage($scope.Job.job_number)) )
      .catch( ({data}) => console.log(data))
  }

})