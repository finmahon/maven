angular.module('citiClientOnboarding').directive('onboardingStatus', ['KieProcessInstanceService', '$q', function (KieProcessInstanceService, $q) {

  

  return {
    restrict: 'E',
    replace: true,
    scope: {
        pid: '='
    },
    templateUrl: 'partials/directives/onboardingStatus.html',
    link: function ($scope, element, attrs) {

        var caseState, subProcessState;

        function getInstantVariables() {
            var fns=[];
            angular.forEach(['caseState','subProcessState'], function(varName){

                var fn = KieProcessInstanceService.getProcessInstanceVariable($scope.pid, varName).then(function (response) {
                        console.log('Succefully retrieved instance variable caseState');
                        
                        return response.data;
                    }, function (err) {
                        console.log('Failed to retrieved All task instances for process ID with response: ' + JSON.stringify(err));
                    });

                fns.push(fn);
                });

             return $q.all(fns).then(updateUI);
         }

        function updateUI(result){
            console.log('Got case state variables', result[0], result[1]);
            caseState = result[0];
            subProcessState = result[1];

            $scope.initation = caseState.Initiation;
            // $scope.docs = caseState.SUBPROCESSES;
            $scope.implement = caseState.Implementation;
            $scope.training = caseState.Training;

            $scope.showKYC = true;
            $scope.showCredit = true;

            if(caseState.SUBPROCESSES == 'complete'){
                $scope.kyc = 'complete';
                $scope.docs = 'complete';
                $scope.credit = 'complete';
            } else {
                $scope.kyc = caseState.SUBPROCESSES === 'active' ? subProcessState.KYC : 'inactive';
                $scope.docs = caseState.SUBPROCESSES === 'active' ? subProcessState.Documents : 'inactive';
                $scope.credit = caseState.SUBPROCESSES === 'active' ? subProcessState.Credit : 'inactive';
            }
        }

        getInstantVariables();

        $scope.$on('updateChevrons',function(event, data){
            console.log('updating chevrons');
             getInstantVariables();
        });
        

      




    }
  };
}]);
