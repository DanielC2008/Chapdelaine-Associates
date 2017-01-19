'use strict'

app.controller('Login-Register', function($scope, $http, $location, $rootScope) {
  $scope.loginOrRegister = 'login'

  const legitPassword = password => {
    const pattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")
    return pattern.test(password)
  }

  const fieldsFilled = () => {
    let formStatus = $scope.formData && $scope.formData.password && $scope.formData.userName ? true : false
    return formStatus
  }

  const enterSite = () => {
      return $http.post(`/api/${$scope.loginOrRegister}` , {
        user_name: $scope.formData.userName,
        password: $scope.formData.password
      })
      .success( data => {
        if (data.user_name) {
          $rootScope.$user = data.user_name
          $location.path('/home')
        } else {
          alert(`${data.msg}`)
        }
      })
      .error( data => {
        alert("There was an error achieving your credentials. Please try again.")
      })
  }

  $scope.passTests = (password) => {
    const testPassword = legitPassword(password)
    const testForm = fieldsFilled()
    if (testPassword && testForm) {
      enterSite()
    } else if ( !testForm ) {
      alert("User Name and Password fields required!")
    }
     else {
      alert("Password must be at least 8 characters long including one uppercase letter, one lowercase letter, and one number!")
    }

  }

  $scope.register = () => {
    $scope.loginOrRegister = 'register'
  }

  $scope.login = () => {
    $scope.loginOrRegister = 'login'
  } 
})