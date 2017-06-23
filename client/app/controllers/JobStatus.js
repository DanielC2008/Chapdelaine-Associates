'use strict'

app.controller('JobStatus', function($scope, JobFactory, DBFactory, ToastFactory, $mdDialog, $route) {
  let JSscope = this
  $scope.Job = {}
  JSscope.currStatus = $scope.jobInfo ? $scope.jobInfo.jobStatus : 'New' //---if job already exists else 'New'
  
  const submitJobStatus = () => {
    if (JSscope.currStatus === 'New') {
      JobFactory.createNewJob($scope.Job)
        .then( ({data}) => {
          ToastFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          JobFactory.goToJobPage($scope.Job.job_number)
        })
        .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
    } else {
      JobFactory.updateJobStatus({jobObj: $scope.Job, currJobNum: $scope.jobInfo.jobNumber})
        .then( ({data}) => {  
          ToastFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          $scope.jobInfo.jobNumber == data.job_number ? $route.reload() : JobFactory.goToJobPage(data.job_number)
        })
        .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
    }
  }

  const addStartDate = () => $scope.Job.start_date = new Date()

  const addCompleteDate = () => $scope.Job.complete_date = new Date()

  const removeStartDate = () => $scope.Job.start_date = null

  const removeCompleteDate = () => $scope.Job.complete_date = null

  const addMinJobNumber = () => {
    DBFactory.getMinNumber({table: 'Jobs'})
      .then( ({data: {min}}) => { 
        (min < 0) ? $scope.Job.job_number = min - 1 : $scope.Job.job_number = -1
        submitJobStatus() 
      })
      .catch( (data) => data.data ? ToastFactory.toastReject(data.msg) : console.log('data', data))
  }
  
  JSscope.jobCanceled = () => {
    $scope.Job.job_status = 'Canceled'
    $scope.jobCanceled = true
  }

  JSscope.jobPending = () => {
    $scope.Job.job_status = 'Pending'
    if( JSscope.currStatus === 'Active') {
      removeStartDate()
    }
    addMinJobNumber()
  }

  JSscope.jobActive = () => {
    $scope.Job.job_status = 'Active'
    if ( JSscope.currStatus === 'Complete'){
      removeCompleteDate()
      submitJobStatus()
    } else{
      addStartDate()
      $scope.newJobNumberRequired = true
    }
  }

  JSscope.jobComplete = () => {
    $scope.Job.job_status = 'Complete'
    if ( JSscope.currStatus === 'Active') { 
      addCompleteDate()
      submitJobStatus() 
    } else {
      addStartDate()
      addCompleteDate() 
      $scope.newJobNumberRequired = true
    }
  } 

  JSscope.addJobStatus = status => {
    $scope.Job.job_status = status
    statusPath(status)
  }

  $scope.numberSet = job_number => { //for RecommendedNumber
    if (job_number > 0) {
      $scope.Job.job_number = job_number
      submitJobStatus()
    } else {
      ToastFactory.toastReject('Job number must be greater than 0!')
    }
  }

  $scope.causeSet = cause_id => { //for JobCanceled
    $scope.Job.cause_id = cause_id
    submitJobStatus() 
  }  

})






