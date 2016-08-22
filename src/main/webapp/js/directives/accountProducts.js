angular.module('citiClientOnboarding').directive('accountProducts', function () {

  

  return {
    restrict: 'E',
    replace: true,
    scope: {
        accounts: '='
      },
    templateUrl: 'partials/directives/accountProducts.html',
    link: function ($scope) {


      if (!$scope.accounts){
        $scope.accounts = [];
      }

      // $scope.accounts = [
      //   {
      //     "name": "Main",
      //     "branch": "branch1",
      //     "currency": "euro",
      //     "type": "Current",
      //     "products": [
      //       "Cash",
      //       "FX",
      //       "Online Banking",
      //       "Digital Signatures"
      //     ]
      //   },
      //   {
      //     "name": "Auxilary",
      //     "branch": "branch2",
      //     "currency": "sterling",
      //     "type": "Deposit",
      //     "products": [
      //       "FX",
      //       "Credit",
      //       "Digital Signatures",
      //       "Trade"
      //     ]
      //   }
      // ];

      

     

    }
  };
});
