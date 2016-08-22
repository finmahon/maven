angular.module('citiClientOnboarding').controller('CaseController',
    ['$scope', '$http', '$location', 'KieServerService', 'KieProcessInstanceService', '$log', 'Constants', '$q', 'StateStore', 'DTOptionsBuilder', 'DTColumnBuilder',
    function ($scope, $http, $location, KieServerService, KieProcessInstanceService, $log, Constants, $q, StateStore, DTOptionsBuilder, DTColumnBuilder) {
        
    $scope.$location = $location;
    $scope.constants = Constants;
    

    var vm = this; 
    
    $scope.caseHomepage = function ( path ) {
        $location.path( path );
    };
    
    $scope.openCase = function(process) {
        // StateStore.setCurrentCase(process);
        $location.path( '/cases/'+process['process-instance-id']);
    };
    
    var processes=[];
    function getProcessInstances () {
        var deferred = $q.defer();
        KieProcessInstanceService.getAllProcessInstances(KieServerService.getKieCitiNTBProcessID()).then(function (response) {
            $log.debug('Succesfully retrieved Process Instance data with responses: ' + response.status);
            processes = response.data['process-instance'];
            deferred.resolve();
        }, function (response) {
            // Failed To Retrieve Processes throw error message
            $log.error('Failed to retrieve form data with reponse: ' + JSON.stringify(response.data));
        });
        return deferred.promise;
    }
    
    // Work's out TAT Date
    $scope.daysBetween = function(startDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        //var diffDays = Math.round((new Date().getTime() - startDate) / millisecondsPerDay);
        var diffDays = Math.abs((new Date().getTime() - startDate)/(millisecondsPerDay));
        
        // Return Whole Number is >= 10
        if (diffDays >= 10){
            return Math.round(diffDays);
        } 

        return +diffDays.toFixed(1);
    };

    var promises = [];
    function getProcessVariables () {
        angular.forEach(processes, function(process){
            // var deffered  = $q.defer();
            var fn = KieProcessInstanceService.getAllVariablesForProcessInstance(process['process-instance-id']).then(function(response){
                $log.debug('Succesfully retrieved Vaiables for process ' + process['process-instance-id']);
                var variables = {};
                // Parse each Process Variable Instance and add to an array to be pushed into Process Instance Array
                angular.forEach(response.data['variable-instance'], function(variableInstance){
                    variables[variableInstance.name] = variableInstance.value;
                });
                
                process.variables = variables;
                // deffered.resolve(response);
            });
             promises.push(fn);
        });
        return $q.all(promises).then(saveProcesses);
    }
                                   
    function saveProcesses(){
        $scope.loading = false;
        $log.debug('Finished loading data. Loading Complete...');
        $scope.processes = processes;
        StateStore.setSavedProcesses($scope.processes);
    }
         
    $scope.getCases = function () {
        $scope.loading = true;
        getProcessInstances().then(getProcessVariables);
    };
        
       
     vm.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(5).withOption('aaSorting', [6, 'desc']);
                                   
}]);
