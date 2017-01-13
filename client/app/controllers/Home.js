'use strict'

app.controller('Home', function($scope, $http, $rootScope) {
  let HomeScope = this

  HomeScope.title = "home"
    $http.get('/home')
    .success( data => {
      HomeScope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
  })