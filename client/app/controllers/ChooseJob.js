"use strict"

  app.controller('ChooseJob', function($scope, FindJobService, JobFactory) {

    let Jobs = FindJobService.getFoundJobs()

    

    $scope.Jobs = [
      {
        job_number: '1245',
        client_name: 'Billy Jean'
      },
      {
        job_number: '3444',
        client_name: 'Billy Jean'
      },
      {
        job_number: '5546',
        client_name: 'Billy Jean'
      },
    ]


    $scope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)


  })