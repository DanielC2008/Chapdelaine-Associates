'use strict'

app.controller('Home', function($scope, JobFactory) {

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

  JobFactory.getActiveJobs()
    .then( ({data}) => $scope.activeJobs = data)
    .catch( ({data}) => console.log(data))

  JobFactory.getPendingJobs()    
    .then( ({data}) => $scope.pendingJobs = data)
    .catch( ({data}) => console.log(data))
  })