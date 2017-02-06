'use strict'

app.controller('SearchFilter', function($scope) {
  let SFscope = this
  let JMscope = $scope.$parent

  SFscope.filter = searchText => items.filter( item => item.value.search(searchText.toLowerCase()) != -1)
  
  let items = JMscope.items.map( obj => { 
    let newObj = {}
    newObj.display = `${obj.value}`
    newObj.value = `${obj.value}`.toLowerCase()
    return newObj
  })

})