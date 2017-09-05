'use strict'

app.controller('SearchFilter', function($scope, $mdDialog, items, allowNew, formForNew) {
  let SFscope = this

  SFscope.allowNew = allowNew

  SFscope.formForNew = formForNew

  SFscope.filter = searchText => items.filter( item => item.value && item.value.toLowerCase().search(searchText.toLowerCase()) != -1 )
  
  SFscope.existing = selected => $mdDialog.hide(selected)

  SFscope.userInput = input => $mdDialog.hide({value: input})

  SFscope.new = () => $mdDialog.hide()
  
  SFscope.cancel = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

})