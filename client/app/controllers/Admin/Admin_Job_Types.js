'use strict'

app.controller('Admin_Job_Types', function($scope, JobFactory, ToastFactory, AdminFactory, $route) {
  let JT = this

  JT.priorityChanged = false

  JobFactory.getAllJobTypes().then( ({data}) => {
    JT.selected = null
    JT.job_types = data
  }) 

  // // Model to JSON for demo purpose
  $scope.$watch('models', function(model) {
      $scope.modelAsJson = angular.toJson(model, true);
  }, true);

  JT.addNew = () => {
    JobFactory.addNewJobType().then( ({msg}) => {
      AdminFactory.setTab('JT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  JT.moved = index => {
    JT.job_types.splice(index, 1)
    JT.priorityChanged = true
  }

  JT.savePriority = () => {
    reprioritize()
  }

  const reprioritize = () => {
    JT.job_types.forEach( (type, index) => type.priority = index)
    console.log('herr', JT.job_types)
  }
})