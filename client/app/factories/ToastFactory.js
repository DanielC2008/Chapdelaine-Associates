'use strict'

app.factory('ToastFactory', function($mdToast) {

  const factory = {}

  factory.toastSuccess = message => {
    let msg = message === undefined ? 'Success' : message
    return $mdToast.show(
      $mdToast.simple()
        .textContent(`${msg}`)
        .position('top right')
        .hideDelay(3000)
        .toastClass('toastSuccess')
    )
  }

  factory.toastReject = message => {
    let msg = message === undefined ? 'Error' : message
    return $mdToast.show(
      $mdToast.simple()
        .textContent(`${msg}`)
        .position('top right')
        .hideDelay(3000)
        .toastClass('toastReject')
    )
  }

  return factory
})  
