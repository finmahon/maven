angular.module('citiClientOnboarding').controller('CaseDashboardController',
    ['$rootScope', '$scope','$http', '$route', '$location', '$filter', '$timeout', 'StateStore','KieProcessInstanceService', 'KieTaskManagementService', '$q', '$log', '$modal',
    function($rootScope, $scope, $http, $route, $location, $filter, $timeout, StateStore,KieProcessInstanceService, KieTaskManagementService, $q, $log, $modal){

    // pull selected process from storage
    var pinstID  = $route.current.params.CASE;
    var currentCase = StateStore.getCurrentProcess(pinstID);
    $scope.pid = pinstID;
    $scope.comments = [];


      // Add Comment
    function addComment(comment, isCase, tInstanceId ) {
        var tempStr;
        if (isCase){
            tempStr = '<p><b>Date added: </b>' + $filter('date')(new Date(), 'MM/dd/yyyy') + '</p><p>' + comment + '</p>';
        } else {
            var taskName = _.find($scope.processTasks, {"task-id":tInstanceId})['task-name'];
            tempStr = '<p><b>Date added: </b>' + $filter('date')(new Date(), 'MM/dd/yyyy') + ' <b>Task ID: </b>' +
                tInstanceId + ' <b>Task Name: </b>' +
                taskName.substr(0, 14) + '</p><p>' +
                comment + '</p>';
        }
        $scope.comments.push(tempStr);
    }
    
    // Obtain All Task Instances for a given Process/Case Instance
    var getAllTaskInstances = function (){
        var deferred = $q.defer();
        KieTaskManagementService.getAllProcessInstanceTasks($scope.currentCase['process-instance-id']).then(function (response) {
            $log.debug('Succefully retrieved ' + response.data['task-instance'].length + ' task instances for process ID: ' + $scope.currentCase['process-instance-id']);
            
            //update UI
            $scope.processTasks = _.sortBy(response.data['task-instance'], function(i){return i['task-id'];});
            deferred.resolve(response.data['task-instance']);
        }, function (err) {
            $log.error('Failed to retrieved All task instances for process ID with response: ' + JSON.stringify(err));
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var getCaseOwners = function(res) {
        var fns = [];
        angular.forEach(res, function(task){
            console.log('TASK In: ', task);
            taskprocessid = task['task-process-instance-id'];
            varName = 'creditTaskBusinessOwner';
            var fn = KieProcessInstanceService.getProcessInstanceVariable(taskprocessid, varName).then(function (response) {
                    console.log('Succefully retrieved instance variable ' + varName + ' for taskId ' + task['task-id'] + ': ' + response.data);
                
                return ({task: task['task-id'], caseOwner: response.data});
            }, function (err) {
                console.log('Failed to retrieved All task instances for process ID with response: ' + JSON.stringify(err));
                return ({error: err});
            });

            fns.push(fn);
        });

        return $q.all(fns);
    };

    function updateUIwithCaseOwners (caseOwners){
         angular.forEach(caseOwners, function(obj){
            if(obj.task){
                var task = _.find($scope.processTasks, function(o) { return o['task-id'] === obj.task; });
                task['task-business-owner'] = obj.caseOwner;
            }

         });
        
    }

      // Obtain All Task Instances for a given Process/Case Instance
    function getInstantVariable(varName) {
        KieProcessInstanceService.getProcessInstanceVariable(pinstID, varName).then(function (response) {
            $log.debug('Succefully retrieved instance variable ',varName);
            
            $scope[varName] = response.data;
        }, function (response) {
            $log.error('Failed to retrieved All task instances for process ID with response: ' + JSON.stringify(response.data));
        });
    }

    function loadTasks(){
         // getAllTaskInstances();
        getAllTaskInstances()
            .then(getCaseOwners).then(function(res){
                console.log('got case owners updateing UI', res);
                updateUIwithCaseOwners(res);
            }, function(err){
                console.log('error from getAllTaskInstances', err);
            });

    }

    //check for null returned
    if (currentCase){
        $scope.currentCase = currentCase;
        
        loadTasks();
       
        getInstantVariable('accounts');
        //check accounts present before making call
        if(currentCase.variables.contacts){
            getInstantVariable('contacts');
        }

        console.log('currentCase', currentCase);
    } else {
        $log.error('Error finding Process id no. ' + $route.current.params.CASE + ' navigating back to Cases Screen');
        $location.path('/cases');
    }

    $scope.saveCurrentCaseVariable = function(varName, value) {
        console.log('saving variable ', varName, value);
        KieProcessInstanceService.updateProcessInstanceVariable(pinstID,varName, JSON.stringify(value)).then(function (response) {
            $log.debug('Succesfully saved variable : ' + varName + ':' + value);

        }, function (response) {
            // Failed To Retrieve Processes throw error message
            $log.error('Error saving variable : ' + varName + ':' + value + 'error:' + JSON.stringify(response.data));
        });
    };
    
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



    
    // Perform Task Operations & refresh Task Instance List
    $scope.updateTaskInstanceState = function (tInstanceId, operation, body) {
        var deferred = $q.defer();
        KieTaskManagementService.updateTaskState(tInstanceId, operation, body).then(function (response) {
            $log.debug('Succefully updated task ' + tInstanceId + ' with the status: ' + operation);
            deferred.resolve(response);

            loadTasks();

            //if a task is updated use broadcast event to get chevron directive to update
            if (operation === 'completed') {
                $rootScope.$broadcast('updateChevrons',{});
            }
        }, function (response) {
            $log.error('Failed to updated task ' + tInstanceId + ' with the status: ' + operation + ' with reponse: ' + JSON.stringify(response.data));
        });
        return deferred.promise;
    };
    
    // open modal get input data
    // if there's a tInstanceId in the call then load task form and get form input and comments
    // otherwise just get case comment
    //
    $scope.modalTaskViewOpen = function (tInstanceId) {
        var currentTask = tInstanceId ?  tInstanceId : null;
   
        var modalInstance = $modal.open({
            templateUrl: 'partials/modals/taskFormComment.html',
            controller: 'ModalTaskView as vm',
            resolve: {
                currentTask: function () {
                    return currentTask;
                    }
                }
            }
        );
        
        modalInstance.result.then(function (returnedObj) {
            //$scope.selected = selectedItem;
            $log.debug("Back from Modal Action with...", returnedObj);

            //handel comment from task or from case
            if(returnedObj.comment && returnedObj.comment.length>0){
                if(tInstanceId){
                    // handle task comment
                    addComment(returnedObj.comment, false, tInstanceId);
                } else {
                    //handle case comment
                    addComment(returnedObj.comment, true);
                }
            }

            // handle task form data
            if(currentTask) {
                // get sub process id
                var pID = _.find($scope.processTasks, {"task-id":tInstanceId})['task-process-instance-id'];

                var formReturnObj = {} ;
                for (var property in returnedObj) {
                    if (returnedObj.hasOwnProperty(property) && property !== 'comment' ) {
                        formReturnObj[property] = returnedObj[property];
                    }
                }
                console.log('sending completion object', formReturnObj);
                // send complete call with formdata
                $scope.updateTaskInstanceState(tInstanceId, 'completed', formReturnObj);
            }

        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    
}]);