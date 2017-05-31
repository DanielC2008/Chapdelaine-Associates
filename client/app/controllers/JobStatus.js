'use strict'

app.controller('JobStatus', function($scope, JobFactory, $mdDialog, $route) {
  let JSscope = this

  JSscope.currJobStatus = $scope.jobInfo ? $scope.jobInfo.jobStatus : 'New' //---if job already exists else 'New'
  $scope.Job = {}
  $scope.newJobNumberRequired = false
  $scope.jobCanceled = false

  const submitJobStatus = () => {
    if (JSscope.currJobStatus === 'New') {
      JobFactory.createNewJob($scope.Job)
        .then( ({data}) => {
          JobFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          JobFactory.goToJobPage($scope.Job.job_number)
        })
        .catch( ({data}) => JobFactory.toastReject(data.msg))
    } else {
      JobFactory.updateJobStatus({jobObj: $scope.Job, currJobNum: $scope.jobInfo.jobNumber})
        .then( ({data}) => {  
          JobFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          $scope.jobInfo.jobNumber == data.job_number ? $route.reload() : JobFactory.goToJobPage(data.job_number)
        })
        .catch( (data) => console.log('data', data))
    }
  }


  const addStartDate = () => $scope.Job.start_date = new Date()

  const addCompleteDate = () => $scope.Job.complete_date = new Date()

  const removeStartDate = () => $scope.Job.start_date = null

  const removeCompleteDate = () => $scope.Job.complete_date = null


  const addMinJobNumber = () => {
    JobFactory.getMinJob()
      .then( ({data: {min}}) => { 
        if ( min < 0 ) { 
          $scope.Job.job_number = min - 1
        } else {
          $scope.Job.job_number = -1
        }
        submitJobStatus() 
      })
      .catch( ({data}) => console.log(data))
  }
  
  const statusPath = status =>  {
    if ( JSscope.currJobStatus === 'New') {
      if (status === 'Canceled') { //status, minJobNumber, reason
        $scope.jobCanceled = true
        // addMinJobNumber()
      }
      else if (status === 'Pending') { //status, minJobNumber
        addMinJobNumber()
      }
      else if (status === 'Active') {  //status, JobNumber, startDate
        addStartDate()
        $scope.newJobNumberRequired = true
      }
      else if (status === 'Complete') { //status, JobNumber, startDate, completeDate
        addStartDate()
        addCompleteDate() 
        $scope.newJobNumberRequired = true
      }
    }

    else if (JSscope.currJobStatus === 'Canceled') {
      if (status === 'Pending') { //status, minJobNumber
        addMinJobNumber()
      }
      else if (status === 'Active') { //status, JobNumber, and StartDate
        addStartDate()
        $scope.newJobNumberRequired = true
      }
    } 

    else if ( JSscope.currJobStatus === 'Pending') {
      if (status === 'Canceled') { //status, reason
        $scope.jobCanceled = true
        // submitJobStatus()
      }
      else if (status === 'Active') { //status, JobNumber, and StartDate
        addStartDate()
        $scope.newJobNumberRequired = true
      }
      else if (status === 'Complete') { //status, JobNumber, StartDate, completeDate
        addStartDate()
        addCompleteDate()
        $scope.newJobNumberRequired = true
      }
    }

    else if ( JSscope.currJobStatus === 'Active') {
      if (status === 'Canceled') { //status, reason
        $scope.jobCanceled = true
        // submitJobStatus()
      }
      else if (status === 'Pending') { //status, removeStartDate
        removeStartDate()
        addMinJobNumber()
      }
      else if (status === 'Complete') {  //status, completeDate
        addCompleteDate()
        submitJobStatus() 
      }
    }

    else if ( JSscope.currJobStatus === 'Complete') {
      if (status === 'Active') { //status, removeCompleteDate 
        removeCompleteDate()
        submitJobStatus()
      }
    }

  }   

  JSscope.addJobStatus = status => {
    $scope.Job.job_status = status
    statusPath(status)
  }

  $scope.numberSet = job_number => {
    if (job_number > 0) {
      $scope.Job.job_number = job_number
      submitJobStatus()
    } else {
      JobFactory.toastReject('Job number must be greater than 0!')
    }
  }

  $scope.causeSet = cause_id => $scope.Job.cause_id = cause_id

})






