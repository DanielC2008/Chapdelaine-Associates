'use strict'

app.controller('ChooseClient', function($scope, $mdDialog, clientArray) {
  let ParentScope = $scope
  let CCScope = this

  CCScope.clientNames = clientArray

  CCScope.chooseClient = client => {
    $mdDialog.hide(client)
  }

})