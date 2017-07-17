'use strict'

app.factory('CancellationFactory', function($http, FormFactory) {

  const factory = {}

  factory.getCauses = () => $http.get('api/getCauses')

  factory.addNewCause = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Cancellations', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  return factory
})
