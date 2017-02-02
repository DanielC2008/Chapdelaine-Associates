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

let items

    $http
      .get('api/getClientNames')//should pass in user_id here
      .then(({data}) => {
        console.log(data);
        items = makeItemsArray(data)
      })
      .catch(err => console.log(err))


  $scope.filter = searchText => items.filter( item => item.value.search(searchText.toLowerCase()) != -1)

  const makeItemsArray = itemsObj => {
    return itemsObj.map( obj => {
      let newObj = {}
      newObj.display = `${obj.value}`
      newObj.value = `${obj.value}`.toLowerCase()
      return newObj
    })
  }

  //make Properties separate from Rep and Clients
  //break this out into its own controller or multiple controllers
  //eventually introduce this into find job


  //maybe instead make a filter factory and ng-include template



})






