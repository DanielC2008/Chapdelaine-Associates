'use strict'

app.factory('SearchFactory', function($http, $mdDialog) {

  const factory = {}

  factory.addBySearch = items => {
    return new Promise ((resolve, reject) => { 
      let locals = {items: items}
      $mdDialog.show({
        locals,
        controller: 'SearchFilter as SF',
        templateUrl: '/partials/searchFilter.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false
      })
      .then( id => resolve(id))
      .catch( err => reject(err)) 
    })  
  }

  const getRepresentativesBySearch = () => $http.get('/api/getRepresentativesBySearch')

  return factory
})