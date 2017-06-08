'use strict'

app.controller('JobCanceled', function($scope, JobFactory) { 
  let JCscope = this

   $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  JobFactory.getCauses().then( ({data}) => JCscope.causes = data)

  JCscope.selected = cause_id => $scope.causeSet(cause_id)

})