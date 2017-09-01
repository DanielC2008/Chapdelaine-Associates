'use strict'

app.controller('JobCanceled', function($scope, CancellationFactory, $mdDialog) { 
  let JCscope = this

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }
  CancellationFactory.getCauses().then( ({data}) => JCscope.causes = data)
  
  JCscope.selectedCause = null

  JCscope.selected = () => $mdDialog.hide(JCscope.selectedCause)

  JCscope.canceled = () => $mdDialog.hide()

})