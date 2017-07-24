'use strict'

app.controller('JobStatus', function($scope, JobFactory, DBFactory, ToastFactory, $mdDialog, $route) {
  let JSscope = this
   // const submitJobStatus = () => $scope.statusSet(JSscope.jobInfo)
  // const submitJobStatus = () => {
  //   if (JSscope.currStatus === 'New') {
  //     JobFactory.createNewJob($scope.Job)
  //       .then( ({data}) => {
  //         ToastFactory.toastSuccess(data.msg)
  //         $mdDialog.hide()
  //         JobFactory.goToJobPage($scope.Job.job_number)
  //       })
  //       .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
  //   } else {
  //     JobFactory.updateJobStatus({jobObj: $scope.Job, currJobNum: $scope.jobInfo.jobNumber})
  //       .then( ({data}) => {  
  //         ToastFactory.toastSuccess(data.msg)
  //         $mdDialog.hide()
  //         $scope.jobInfo.jobNumber == data.job_number ? $route.reload() : JobFactory.goToJobPage(data.job_number)
  //       })
  //       .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
  //   }
  // }

  const addStartDate = () => $scope.job.jobInfo.start_date = new Date()

  const addCompleteDate = () => $scope.job.jobInfo.complete_date = new Date()

  const removeStartDate = () => $scope.job.jobInfo.start_date = null

  const removeCompleteDate = () => $scope.job.jobInfo.complete_date = null

  const updateStatus = status => {
    if (status != 'Canceled') {
      console.log('here')
      $scope.job.jobInfo.cause_id = null
      $scope.showCause(null)
    }
    $scope.job.jobInfo.job_status = status
  }  
  const addMinJobNumber = () => {
    DBFactory.getMinNumber({table: 'Jobs'})
      .then( ({data: {min}}) => { 
        (min < 0) ? $scope.job.jobInfo.job_number = min - 1 : $scope.job.jobInfo.job_number = -1 
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
      console.log('cause', cause.cause)
      updateStatus('Canceled') 
      $scope.showCause(cause.cause) 
      $scope.job.jobInfo.cause_id = cause.cause_id
    })
  }
  
  JSscope.jobChangeHold = () => {
    $scope.job.jobInfo.on_hold = $scope.job.jobInfo.on_hold === true ? false : true
  }

  JSscope.jobPending = () => {
    if( $scope.job.jobInfo.job_status === 'Active') {
      $scope.job.jobInfo.on_hold = false
      removeStartDate()
    }
    updateStatus('Pending')
    addMinJobNumber()
  }

  JSscope.jobActive = () => {
    if ( $scope.job.jobInfo.job_status === 'Complete'){
      updateStatus('Active')
      removeCompleteDate()
    } else if ( $scope.job.jobInfo.job_status === 'Canceled' && $scope.job.jobInfo.job_number > 0 ) {
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
        $scope.job.jobInfo.on_hold = false
        $scope.job.jobInfo.job_number = job_number
      })
    }
  }

  JSscope.jobComplete = () => {
    if ( $scope.job.jobInfo.job_status === 'Active') { 
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
        $scope.job.jobInfo.job_number = job_number
      })
    }
  } 

})






