/**
 * Created by ajarrett : ajarrett@redhat.com on 18/07/16.
 * Kie Task Instance Management Status Service
 */

(function () {
    'use strict';

    angular.module('citiClientOnboarding')
        .factory('KieTaskManagementService', ['$http', 'KieServerService', KieTaskManagementService]);
        
    function KieTaskManagementService($http, KieServerService) {
        
        /** TASK Management Services 
        * Desc : API's to invoke KIE Task Services i.e. Claim/Release/Complete etc...
        * Path : http://localhost:8080/kie-serverindex.html/services/rest/server/containers/{id}/tasks
        */
        var kieManagementBaseURL = KieServerService.getKieServerUrl() + "/kie-server/services/rest/server/containers/" + KieServerService.getKieExecutionContainerName();
        
        var taskManagementURL = kieManagementBaseURL + "/tasks";
        
        /** TASK QUERY Services 
        * Desc : Query Tasking API's to return information around Task Ownership & Management
        * Path : http://localhost:8080/kie-serverindex.html/services/rest/server/queries
        */
        var taskQueryURL = KieServerService.getKieServerUrl() + "/kie-server/services/rest/server/queries/tasks/instances";
        
        var service = {};

        //TODO: Add Pagination, PageSize, Status and other parameters
        
        // ::: MANAGEMENT TASK SERVICE INTERFACE ::: \\
        service.getTask = getTask;
        service.getTaskForm = getTaskForm;
        service.getTaskComments = getTaskComments;
        service.addTaskComments = addTaskComments;
        service.getTaskInputContents = getTaskInputContents;
        service.getTaskOutputContents = getTaskOutputContents;
        service.updateTaskContents = updateTaskContents;
        service.updateTaskDescription = updateTaskDescription;
        service.updateTaskExpiration = updateTaskExpiration;
        service.updateTaskName = updateTaskName;
        service.updateTaskPriority = updateTaskPriority;
        service.updateTaskState = updateTaskState;
        
        
        // ::: QUERY TASK SERVICE INTERFACE ::: \\
        service.getAllUserOwnedTasks = getAllUserOwnedTasks;
        service.getAllAdminOwnedTasks = getAllAdminOwnedTasks;
        service.getAllUserPotentialTasks = getAllUserPotentialTasks;
        service.getAllProcessInstanceTasks = getAllProcessInstanceTasks;
        service.getTaskVariable = getTaskVariable;

        return service;

        // ::: MANAGEMENT TASK SERVICE IMPL ::: \\
        
        // GET :: Return specific Task
        function getTask(tInstanceId){
            return $http.get(taskManagementURL + '/' + tInstanceId);
        }
        
        // GET :: Return specific Task Form
        function getTaskForm(tInstanceId){
            // example http://localhost:8080/kie-server/services/rest/server/containers/citi_onboarding/forms/tasks/7
            console.log('getTaskForm - ', kieManagementBaseURL + '/forms/tasks/' + tInstanceId);
            return $http.get(kieManagementBaseURL + '/forms/tasks/' + tInstanceId);
        }
        
        // GET :: Return all Comments for Task
        function getTaskComments(tInstanceId){
            return $http.get(taskManagementURL + '/' + tInstanceId + '/comments');
        }
        
        // POST :: Add new Comments to Task
        function addTaskComments(tInstanceId){
            return $http.post(taskManagementURL + '/' + tInstanceId + '/comments');
        }
        
        // GET :: Return all Task input Variables
        function getTaskInputContents(tInstanceId){
            return $http.get(taskManagementURL + '/' + tInstanceId + '/contents/input');
        }
        
        // GET :: Return all Task output Variables
        function getTaskOutputContents(tInstanceId){
            return $http.get(taskManagementURL + '/' + tInstanceId + '/contents/output');
        }
        
        // PUT :: Return update Task Variables
        function updateTaskContents(tInstanceId){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/contents/output');
        }
        
        // PUT :: Update Task Description
        function updateTaskDescription(tInstanceId){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/description');
        }
        
        // PUT :: Update Task Expire Date
        function updateTaskExpiration(tInstanceId){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/expiration');
        }
        
        // PUT :: Update Task Name
        function updateTaskName(tInstanceId){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/name');
        }
        
        // PUT :: Update Task Priority
        function updateTaskPriority(tInstanceId){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/priority');
        }
        
        // PUT :: Update Task Status:
        function updateTaskState(tInstanceId, status, body){
            return $http.put(taskManagementURL + '/' + tInstanceId + '/states/' + status, body);
        }
        
        // ::: QUERY TASK SERVICE IMPL ::: \\
        
        // Return all tasks owned by current user
        function getAllUserOwnedTasks() {
            return $http.get(taskQueryURL + '/owners');
        }
        
        // Return all tasks requiring management approval
        function getAllAdminOwnedTasks() {
            return $http.get(taskQueryURL + '/admins');
        }
        
        // Return all Tasks current user can claim
        function getAllUserPotentialTasks() {
            return $http.get(taskQueryURL + '/pot-owners');
        }
        
        // Return all Tasks for a particular Process 
        function getAllProcessInstanceTasks(pInstanceId) {
            var config = {
                    'user': KieServerService.getKieDemoUser(),
                    'group': KieServerService.getKieDemoGroup(),
                    'processId': pInstanceId.toString()
                };

            var urlQ = KieServerService.getKieServerUrl() + "/kie-server/services/rest/server/queries/definitions/getTasks/filtered-data?mapper=UserTasks&builder=getTasks";
            return $http.post(urlQ, config);
        }
        
        // Return all Variables for a Task
        function getTaskVariable(varName) {
            return $http.get(taskQueryURL + '/variables/' + varName);
        }
        

    }

})();