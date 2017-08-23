'use strict'

app.controller('Home', function($scope, $rootScope, JobFactory) {

  $rootScope.lastURL = 'home'

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

  })