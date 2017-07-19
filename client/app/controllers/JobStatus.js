'use strict'

app.controller('JobStatus', function($scope, JobFactory, DBFactory, ToastFactory, $mdDialog, $route) {
  let JSscope = this
  JSscope.newJobInfo = {}
  JSscope.currStatus = $scope.jobInfo ? $scope.jobInfo.jobStatus : 'New' //---if job already exists else 'New'
  JSscope.onHold = $scope.jobInfo ? $scope.jobInfo.onHold : false

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
    }).then( cause_id => {
      JSscope.newJobInfo.job_status = 'Canceled'
      JSscope.newJobInfo.cause_id = cause_id
      submitJobStatus()
      
    })
  }
  
  JSscope.jobChangeHold = () => {
    JSscope.onHold === true ? JSscope.newJobInfo.on_hold = false : JSscope.newJobInfo.on_hold = true 
    submitJobStatus()
  }

  JSscope.jobPending = () => {
    JSscope.newJobInfo.job_status = 'Pending'
    if( JSscope.currStatus === 'Active') {
      JSscope.newJobInfo.on_hold = false
      removeStartDate()
    }
    addMinJobNumber()
  }

  JSscope.jobActive = () => {
    JSscope.newJobInfo.job_status = 'Active'
    if ( JSscope.currStatus === 'Complete'){
      removeCompleteDate()
      submitJobStatus()
    } else{
      JSscope.newJobInfo.on_hold = false
      addStartDate()
      $scope.userSetJobNumber()
    }
  }

  JSscope.jobComplete = () => {
    JSscope.newJobInfo.job_status = 'Complete'
    if ( JSscope.currStatus === 'Active') { 
      addCompleteDate()
      submitJobStatus() 
    } else {
      addStartDate()
      addCompleteDate() 
      $scope.userSetJobNumber()
    }
  } 

  // $scope.causeSet = cause_id => { //for JobCanceled
  //   $scope.Job.cause_id = cause_id
  //   // submitJobStatus() 
  // }  

  // JSscope.addJobStatus = status => {
  //   JSscope.newJobInfo.job_status = status
  //   statusPath(status)
  // }



})






