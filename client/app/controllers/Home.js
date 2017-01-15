'use strict'

app.controller('Home', function($scope, JobFactory) {
  let HomeScope = this

  HomeScope.title = "home"

    JobFactory.getActiveJobs()
      .success( data => {
        HomeScope.activeJobs = data
      })
      .error( () => {
        console.log('error')
      })

    JobFactory.getPendingJobs()    
      .success( data => {
        HomeScope.pendingJobs = data
      })
      .error( () => {
        console.log('error')
      })
      
  })