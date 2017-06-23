'use strict'

app.factory('SearchFactory', function($http, $mdDialog, JobFactory) {

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


  factory.chooseOne = (table, options) => {
    let locals = { optionsArr : createArrForChooseOne(table, options) }
    return new Promise ((resolve, reject) => {
      $mdDialog.show({
        locals,
        controller: 'ChooseOne as CO',
        templateUrl: '/partials/chooseOne.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false
      })
      .then( id => resolve(id))
      .catch(err => console.log(err))
    })
  }


  const createArrForChooseOne = (table, options) => {
    return options.map( opt => {
      return {
        id: (table === 'Clients') ? opt.client_id : opt.representative_id,
        name : `${opt.first_name} ${opt.last_name}`
      }  
    })
  }

  return factory
})