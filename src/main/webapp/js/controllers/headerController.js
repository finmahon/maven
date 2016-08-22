angular.module('citiClientOnboarding').controller('HeaderController', function($scope, $http, $location){
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    }
});