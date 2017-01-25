"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'
    $scope.edit = false
    let editCanceled = {}
    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    JobFactory.getJobFromDatabase(jobNumber)
      .success( Job => {
          $scope.Clients = Job.Clients
          $scope.Estimate = Job.Estimates
          $scope.Invoice = Job.Invoices
          $scope.Property = Job.Properties
          $scope.Representatives = Job.Representatives
          $scope.Job = Job.Jobs[0]
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
    //must redigest everytime inorder for input focus to work properly
    $scope.inputToFocus = (index, key, value) => {
      editCanceled.key = key
      editCanceled.value = value
      $scope.inputIndex = index
    }

    $scope.removeInputIndex = () => {
      $scope.inputIndex = null
    }

    $scope.changeFocus = index => {
      if (index === $scope.inputIndex) {
        return true
      }
    }

    $scope.revertEditChanges = obj => {
      obj[editCanceled.key] = editCanceled.value
      console.log(obj);
    }

    // $scope.editOrSave = () => {
    //   $scope.edit ? $scope.edit = false: $scope.edit = true
    //   //save to database//////////////////////////////////////////////
    // }
  })