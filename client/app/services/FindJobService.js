'use strict'

app.service('FindJobService', function($location) {
  const service = {}

    let jobsArr

    service.setFoundJobs = jobs => {
      //pass jobs through sorter
        //sort based on exact match and other
      jobsArr = Object.assign([], jobs)
      $location.path(/jobs/)
    }

    service.getFoundJobs = () => jobsArr
    //get both exact and other 

  return service
})