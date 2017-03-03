'use strict'

app.directive('blur', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.blur, function(value) {
        if(value === true) { 
          element[0].blur();
        }
      });
    }
  };
});