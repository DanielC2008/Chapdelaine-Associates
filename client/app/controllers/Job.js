"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'
    $scope.edit = false
    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    JobFactory.getJobFromDatabase(jobNumber)
      .success( Job => {
          $scope.Clients = Job.Clients
          $scope.Estimate = Job.Estimate
          $scope.Invoice = Job.Invoice
          $scope.Property = Job.Property
          $scope.Representatives = Job.Representatives
          $scope.Job = Job.Job[0]
          console.log($scope.Representatives);
        })
        .error( data => {
          alert('Wooops. There doesn\'t seem to be anything here!')
        })

    $scope.makeChange = (table, id, key, value) => {
      //make sure user wants to make these changes
      let obj = {}
      //transform key to sql table name
      obj[key.toLowerCase().replace(' ', '_')] = value
      JobFactory.editColumn({table, id, obj})
        .success( ({msg}) => {
          alert(msg);
        }).error( ({msg}) => {
          alert(msg);
        })
      }

    // $scope.editOrSave = () => {
    //   $scope.edit ? $scope.edit = false: $scope.edit = true
    //   //save to database//////////////////////////////////////////////
    // }
  })