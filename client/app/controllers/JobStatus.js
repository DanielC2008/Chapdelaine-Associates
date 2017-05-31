'use strict'

app.controller('JobStatus', function($scope, JobFactory, $mdDialog) {
  let JSscope = this

  JSscope.currJobStatus = $scope.jobInfo ? $scope.jobInfo.jobStatus : 'New' //---if job already exists else 'New'
  $scope.Job = {}
  $scope.newJobNumberRequired = false

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
          JobFactory.goToJobPage($scope.Job.job_number)
        })
        .catch( ({data}) => JobFactory.toastReject(data.msg))
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
  
  const followPath = status =>  {
    if ( JSscope.currJobStatus === 'New') {
      if (status === 'Canceled') { //status, minJobNumber, reason
        addMinJobNumber()
        //reason
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
      if (status === 'Pending') { //status //--------------------------------broke
        submitJobStatus()
      }
      else if (status === 'Active') { //status, JobNumber, and StartDate
        addStartDate()
        $scope.newJobNumberRequired = true
      }
    } 

    else if ( JSscope.currJobStatus === 'Pending') {
      if (status === 'Canceled') { //status, reason //--------------------------------broke
        //reason
        submitJobStatus()
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
        //reason
        submitJobStatus()
      }
      else if (status === 'Pending') { //status, removeStartDate
        removeStartDate()
        addMinJobNumber()
      }
      else if (status === 'Complete') {  //status, completeDate //--------------------------------broke
        addCompleteDate()
        submitJobStatus() 
      }
    }

    else if ( JSscope.currJobStatus === 'Complete') {
      if (status === 'Active') { //status, removeCompleteDate  //--------------------------------broke
        removeCompleteDate()
        submitJobStatus()
      }
    }

  }   

  JSscope.addJobStatus = status => {
    $scope.Job.job_status = status
    followPath(status)
  }

  $scope.numberSet = job_number => {
    if (job_number > 0) {
      $scope.Job.job_number = job_number
      submitJobStatus()
    } else {
      JobFactory.toastReject('Job number must be greater than 0!')
    }
  }

})






