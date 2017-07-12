'use strict'

app.controller('JobCanceled', function($scope, CancellationFactory) { 
  let JCscope = this

   $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  CancellationFactory.getCauses().then( ({data}) => JCscope.causes = data)

  JCscope.selected = cause_id => $scope.causeSet(cause_id)

})