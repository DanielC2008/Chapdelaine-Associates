'use strict'

app.controller('Home', function($scope, JobFactory) {

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

    JobFactory.getActiveJobs()
      .success( data => {
        $scope.activeJobs = data
      })
      .error( () => {
        console.log('error')
      })

    JobFactory.getPendingJobs()    
      .success( data => {
        $scope.pendingJobs = data
      })
      .error( () => {
        console.log('error')
      })

  })