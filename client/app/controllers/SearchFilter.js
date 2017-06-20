'use strict'

app.controller('SearchFilter', function($scope, $mdDialog, items) {
  let SFscope = this

  SFscope.filter = searchText => items.filter( item => item.value && item.value.toLowerCase().search(searchText.toLowerCase()) != -1 )
  
  SFscope.existing = selectedId => $mdDialog.hide(selectedId)

  SFscope.new = () => $mdDialog.hide()
  

  SFscope.cancel = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

})