'use strict'

app.controller('SearchFilter', function($scope, $mdDialog, items, allowNew) {
  let SFscope = this

  SFscope.allowNew = allowNew

  SFscope.filter = searchText => items.filter( item => item.value && item.value.toLowerCase().search(searchText.toLowerCase()) != -1 )
  
  SFscope.existing = selected => $mdDialog.hide(selected)

  SFscope.new = () => $mdDialog.hide()
  
  SFscope.cancel = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

})