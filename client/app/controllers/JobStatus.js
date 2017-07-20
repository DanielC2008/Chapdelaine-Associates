'use strict'

app.controller('JobStatus', function($scope, JobFactory, DBFactory, ToastFactory, $mdDialog, $route) {
  let JSscope = this
  JSscope.newJobInfo = {}
  JSscope.currStatus = 'New' //---if job already exists else 'New'
  JSscope.onHold = $scope.currJob.jobInfo.on_hold

   const submitJobStatus = () => $scope.statusSet(JSscope.newJobInfo)
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

  const addStartDate = () => JSscope.newJobInfo.start_date = new Date()

  const addCompleteDate = () => JSscope.newJobInfo.complete_date = new Date()

  const removeStartDate = () => JSscope.newJobInfo.start_date = null

  const removeCompleteDate = () => JSscope.newJobInfo.complete_date = null

  const updateStatus = status => {
    JSscope.newJobInfo.job_status = status
    JSscope.currStatus = status
  }

  const addMinJobNumber = () => {
    DBFactory.getMinNumber({table: 'Jobs'})
      .then( ({data: {min}}) => { 
        (min < 0) ? JSscope.newJobInfo.job_number = min - 1 : JSscope.newJobInfo.job_number = -1
        submitJobStatus() 
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
      $scope.showCause(cause.cause)
      updateStatus('Canceled') 
      JSscope.newJobInfo.cause_id = cause.cause_id
      submitJobStatus()
    })
  }
  
  JSscope.jobChangeHold = () => {
    if (JSscope.onHold === true) {
      JSscope.onHold = false
      JSscope.newJobInfo.on_hold = false
    } else {
      JSscope.onHold = true
      JSscope.newJobInfo.on_hold = true
    } 
    submitJobStatus()
  }

  JSscope.jobPending = () => {
    if( JSscope.currStatus === 'Active') {
      JSscope.newJobInfo.on_hold = false
      removeStartDate()
    }
    updateStatus('Pending')
    addMinJobNumber()
  }

  JSscope.jobActive = () => {
    if ( JSscope.currStatus === 'Complete'){
      updateStatus('Active')
      removeCompleteDate()
      submitJobStatus()
    } else if ( JSscope.currStatus === 'Canceled' && JSscope.newJobInfo.job_number > 0 ) {
      updateStatus('Active')
      submitJobStatus()      
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
        JSscope.newJobInfo.on_hold = false
        JSscope.newJobInfo.job_number = job_number
        submitJobStatus()
      })
    }
  }

  JSscope.jobComplete = () => {
    if ( JSscope.currStatus === 'Active') { 
      updateStatus('Complete') 
      addCompleteDate()
      submitJobStatus() 
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
        JSscope.newJobInfo.job_number = job_number
        submitJobStatus()
      })
    }
  } 

})






