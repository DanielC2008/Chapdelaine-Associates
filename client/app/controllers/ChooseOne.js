'use strict'

app.controller('ChooseOne', function($scope, $mdDialog, optionsArr) {
  let COscope = this
  COscope.options = optionsArr
  COscope.choosen = choice => $mdDialog.hide(choice)
})