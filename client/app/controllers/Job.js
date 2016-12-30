"use strict"

  app.controller('Job', function($scope, $location) {
    $scope.title = "Job"

    let URL = $location.$$url
    let sliceBegin = parseInt(URL.search(":")) + 1 
    let jobNumber = URL.slice(sliceBegin)

    // $http.post('/getJob', {jobNumber})
    //   .success( )
    //   .error( data => {
    //     alert('Wooops. There doesn\'t seem to be anything here!')
    //   })
  })