'use strict'

app.service('FindJobService', function($location) {
  const service = {}

    let jobsArr

    service.setFoundJobs = jobs => {
      sortJobs(jobs)
      //pass jobs through sorter
        //sort based on exact match and other
      // jobsArr = Object.assign([], jobs)
      // $location.path(/jobs/)
    }

    service.getFoundJobs = () => jobsArr
    //get both exact and other 

    let sorted = []
    service.sortJobs = jobs => {
      //for each array of objs
      jobs.forEach( array => {
        checkInSorted(array)
      })
      
    }

    let checkInSorted = array => {
      //check if obj is in Arr of arrays
      array.forEach( obj => {
        if (sorted.length === 0){          
          let newArr = []
          newArr.push(obj)
          sorted.push(newArr)
        }else {
          let index = sorted.findIndex( sortedArr => {
            return _.isEqual(sortedArr[0], obj)
          }) 
          if (index !== -1 ){
            sorted[index].push(obj)
          } else{
            let newArr = []
            newArr.push(obj)
            sorted.push(newArr)
          }
        }
      })
    }

  return service
})