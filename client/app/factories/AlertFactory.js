'use strict'

app.factory('AlertFactory', function($mdToast, $mdDialog) {

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

  factory.summonDisableForm = () => {
    $mdDialog.show({
      fullscreen: true,
      controller: 'DisableForm',
      templateUrl: '/partials/disableForm.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      multiple: true
    }).then().catch( err => console.log('err', err))
  }

  factory.banishDisableForm = () => $mdDialog.hide()

  return factory
})  
