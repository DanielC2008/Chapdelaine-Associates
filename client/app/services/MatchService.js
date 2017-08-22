'use strict'

app.service('MatchService', function() {
  const service = {}
  const matches = {
    exact: [],
    other: []
  }
  const sorted = []

  const clearMatches = () => {
    matches.exact.length = 0
    matches.other.length = 0
    sorted.length = 0
  }

  const pushNew = obj => {
    let newArr = []
    newArr.push(obj)
    sorted.push(newArr)
  }

  const sortJobsByJobNumber = jobsArr => {
    return new Promise( (resolve) => {
      jobsArr.forEach( array => {
        array.forEach( obj => {
          if (sorted.length === 0){          
            pushNew(obj)
          } else {
            let index = sorted.findIndex( sortedArr => {
              return sortedArr[0].job_number === obj.job_number
            }) 
            if (index !== -1 ){
              sorted[index].push(obj)
            } else{
              pushNew(obj)
            }
          }
        })
      })
      resolve()
    })
  }

  //reduces an array of objs with different properties into one obj with only one of each property
  const reduceObj = sortedArr => Object.assign(...sortedArr)

  const createMatchesObj = jobsArrLength => {
    return new Promise( (resolve) => {
      sorted.forEach( sortedArr => {
        //length is equal to number of parameters entered = exact match
        if (sortedArr.length === jobsArrLength) { 
          let obj = reduceObj(sortedArr)
          matches.exact.push(obj)
        } else{
          let obj = reduceObj(sortedArr)
          matches.other.push(obj)
        } 
      })
      resolve()
    })  
  }

  service.setMatches = jobsArr => {
    return new Promise( (resolve) => {
      clearMatches()
      sortJobsByJobNumber(jobsArr).then( () => {
        createMatchesObj(jobsArr.length).then( () => resolve()).catch( err => console.log('err', err))
      }).catch( err => console.log('err', err))
    })
  }

  service.getMatches = () => matches 

  return service
})