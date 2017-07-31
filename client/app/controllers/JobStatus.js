'use strict'

app.controller('JobStatus', function($scope, JobFactory, DBFactory, ToastFactory, $mdDialog, $route) {
  let JSscope = this

  const addStartDate = () => $scope.job.job_info.start_date = new Date()

  const addCompleteDate = () => $scope.job.job_info.complete_date = new Date()

  const removeStartDate = () => $scope.job.job_info.start_date = null

  const removeCompleteDate = () => $scope.job.job_info.complete_date = null

  const updateStatus = status => {
    if (status != 'Canceled') {
      $scope.job.job_info.cause_id = null
      $scope.showCause(null)
    }
    $scope.job.job_info.on_hold = false
    $scope.job.job_info.job_status = status
  }  
  const addMinJobNumber = () => {
    DBFactory.getMinNumber({table: 'Jobs'})
      .then( ({data: {min}}) => { 
        (min < 0) ? $scope.job.job_info.job_number = min - 1 : $scope.job.job_info.job_number = -1 
      })
      .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
  }
  
  JSscope.jobCanceled = () => {
    $mdDialog.show({
      controller: 'JobCanceled as JC',
      templateUrl: './partials/jobCanceled.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    }).then( cause => {
      updateStatus('Canceled') 
      $scope.showCause(cause.cause) 
      $scope.job.job_info.cause_id = cause.cause_id
    })
  }
  
  JSscope.jobChangeHold = () => $scope.job.job_info.on_hold = $scope.job.job_info.on_hold === true ? false : true

  JSscope.jobPending = () => {
    if( $scope.job.job_info.job_status === 'Active') {
      removeStartDate()
    }
    updateStatus('Pending')
    addMinJobNumber()
  }

  JSscope.jobActive = () => {
    if ( $scope.job.job_info.job_status === 'Complete'){
      updateStatus('Active')
      removeCompleteDate()
    //dont redo job # if going from Active to canceled to Active
    } else if ( $scope.job.job_info.job_status === 'Canceled' && $scope.job.job_info.job_number > 0 ) {
      updateStatus('Active')      
    } else {
      $mdDialog.show({
        controller: 'RecommendNumber as RN',
        templateUrl: './partials/recommendNumber.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        multiple: true
      }).then( job_number => {
        updateStatus('Active')
        addStartDate()
        $scope.job.job_info.job_number = job_number
      })
    }
  }

  JSscope.jobComplete = () => {
    if ( $scope.job.job_info.job_status === 'Active') { 
      updateStatus('Complete') 
      addCompleteDate() 
    } else {
      $mdDialog.show({
        controller: 'RecommendNumber as RN',
        templateUrl: './partials/recommendNumber.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        multiple: true
      }).then( job_number => {
        updateStatus('Complete') 
        addStartDate()
        addCompleteDate() 
        $scope.job.job_info.job_number = job_number
      })
    }
  } 

})






