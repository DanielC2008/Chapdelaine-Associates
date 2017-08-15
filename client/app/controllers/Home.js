'use strict'

app.controller('Home', function($scope, JobFactory) {

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

  })