'use strict'

app.factory('SearchFactory', function($mdDialog) {

  const factory = {}

  factory.addBySearch = (items, allowNew, formForNew) => {
    return new Promise ((resolve, reject) => { 
      let locals = {
        items,
        allowNew,
        formForNew
      }
      $mdDialog.show({
        locals,
        controller: 'SearchFilter as SF',
        templateUrl: '/partials/searchFilter.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        multiple: true
      })
      .then( id => resolve(id))
      .catch( err => reject(err)) 
    })  
  }

  return factory
})