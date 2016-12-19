'use strict'


angular
	.module('Database', ['ngRoute'])
  .run(function($rootScope) {
    $rootScope.$user = null
  })
	.config( $routeProvider =>
		$routeProvider
      .when('/login', {
        controller: 'Login-Register',
        templateUrl: 'partials/login-register.html'
      })
			.when('/logout', {
				controller: 'Logout',
        templateUrl: 'partials/logout.html'
			})
			.when('/home', {
				controller: 'Home',
				templateUrl: 'partials/home.html'
			})
			.when('/newJob', {
				controller: 'NewJob',
				templateUrl: 'partials/newJob.html'
			})
			.when('/findJob', {
				controller: 'FindJob',
				templateUrl: 'partials/findJob.html'
			})
      .when('/getData', {
        controller: 'GetData',
        templateUrl: 'partials/getData.html'
      })
			.otherwise('/login')
	)
	.controller('Login-Register', function($scope, $http, $location, $rootScope) {
		$scope.loginOrRegister = 'login'

    const legitPassword = (password) => {
      const pattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")
      return pattern.test(password)
    }

    const fieldsFilled = () => {
      let formStatus = $scope.formData && $scope.formData.password && $scope.formData.userName ? true : false
      return formStatus
    }

    const enterSite = () => {
        return $http.post(`/${$scope.loginOrRegister}` , {
          userName: $scope.formData.userName,
          password: $scope.formData.password
        })
        .success( data => {
          if (data.userName) {
            $rootScope.$user = data.userName
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
	.controller('Home', function($scope, $http, $rootScope) {
		$http.get('/home')
    .success( data => {
      $scope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
	})
	.controller('NewJob', function($scope) {
		$scope.title = "NewJob"
	})
	.controller('FindJob', function($scope) {
		let numberOfParams = 1

    $scope.searchParams = []

    const addParam = () => {
        let obj = {}
        $scope.searchParams.push(obj)
    }

    addParam()

    $scope.createParam = () => {
      numberOfParams++
      addParam()
      //for materialize select tag >:(
      $(document).ready(function() {
        $('select').material_select();
      })
    }

    $scope.submit = () => {
      
    }

	})
	.controller('GetData', function($scope) {
		$scope.title = "GetData"
	})
  .controller('Logout', function($scope, $location, $rootScope) {
    $scope.logout = () => {
      $rootScope.$user = null
      $location.path('/login')
    }
    $scope.stayLoggedIn = () => {
      $location.path('/home')
    }
  })
