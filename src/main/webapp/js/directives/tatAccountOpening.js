angular.module('citiClientOnboarding').directive('tatAccountOpening', function () {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/directives/tatAccountOpening.html',
    link: function (scope, element, attrs) {

        scope.days = 10;

    }
  };
});
