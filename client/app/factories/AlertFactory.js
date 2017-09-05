'use strict'

app.factory('AlertFactory', function($mdToast, $mdPanel) {

  let disableFormScope 
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
    $mdPanel.open({
      fullscreen: true,
      controller: 'DisableForm',
      templateUrl: '/partials/disableForm.html',
      attachTo: angular.element(document.body),
      zIndex: 100,
      trapFocus: true,
      clickOutsideToClose: false,
      escapeToClose: false,
      multiple: true
    })
    .then( panelScope => disableFormScope = panelScope).catch( err => console.log('err', err))
  }

  factory.banishDisableForm = () => disableFormScope.close()

  return factory
})  
