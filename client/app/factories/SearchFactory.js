'use strict'

app.factory('SearchFactory', function($mdDialog) {

  const factory = {}

  factory.addBySearch = (items, allowNew) => {
    return new Promise ((resolve, reject) => { 
      let locals = {
        items,
        allowNew
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

  const createArrForChooseOne = (table, options) => { //right now only works for clients and reps
    return options.map( opt => {
      return {
        id: (table === 'Clients') ? opt.client_id : opt.representative_id,
        name : `${opt.first_name} ${opt.last_name}`
      }  
    })
  }

  return factory
})