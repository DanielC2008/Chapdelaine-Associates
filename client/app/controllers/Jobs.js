"use strict"

  app.controller('Jobs', function($scope) {

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

    $scope.getJob = jobNumber => {
      console.log('job number', jobNumber);
    }


  })