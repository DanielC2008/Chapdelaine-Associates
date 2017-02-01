'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
  $scope.newJob = {}

  $scope.addJobStatus = status => {
    $scope.newJob.job_status = status 
    if (status === 'Pending') {
      JobFactory.getMinJob()
        .then( ({data: {min}}) => { 
          if ( min < 0 ) { 
            $scope.newJob.job_number = min - 1
          } else {
            $scope.newJob.job_number = -1
          }
          createNewJob() 
        })
        .catch( ({data}) => console.log(data))
    }
  }


  //goes to database and finds the last Job number used adds one
  // JobFactory.getMaxJob()
  //   .then( ({data: {max}}) => {
  //     $scope.recommended = max + 1 
  //   })
  //   .catch( ({data}) => console.log(data))

  $scope.addJobNumber = job_number => {
    $scope.newJob.job_number = job_number
    createNewJob()
  }

  const createNewJob = () => {
    JobFactory.createNewJob($scope.newJob)
      .then( () => {
        JobFactory.goToEditAllJobPage($scope.newJob.job_number)
      })
      .catch( ({data}) => console.log(data))
  }


    // $http
    //   .get('api/getClientNames')//should pass in user_id here
    //   .then(({data}) => {
    //     console.log(data);

    //   })
    //   .catch(err => console.log(err))


  $scope.filter = searchText => {
    return Items.filter( item => item.first_name.search(searchText.toLowerCase()) === 0 || item.last_name.search(searchText.toLowerCase()) === 0)
  }

  let Items = [
    {'display': 'Something One', 'first_name': 'something', 'last_name': 'one', 'value': 'one'},
    {'display': 'Something Two', 'first_name': 'something', 'last_name': 'two','value': 'two'},
    {'display': 'Something Else Three', 'first_name': 'something else', 'last_name': 'three','value': 'three'} 
  ]



})






