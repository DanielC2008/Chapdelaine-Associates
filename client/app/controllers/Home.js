'use strict'

app.controller('Home', function($scope, $http, $rootScope) {
  let HomeScope = this

  HomeScope.title = "home"

    $http.get('/activeJobs')
    .success( data => {
      HomeScope.activeJobs = data
    })
    .error( () => {
      console.log('error')
    })

    $http.get('/pendingJobs')
    .success( data => {
      HomeScope.pendingJobs = data
    })
    .error( () => {
      console.log('error')
    })
  })