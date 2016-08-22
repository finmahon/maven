/**
 * Created by ajarrett : ajarrett@redhat.com on 18/07/16.
 * Kie Process Instance Management Status Service
 */

(function () {
    'use strict';

    angular.module('citiClientOnboarding')
        .factory('KieProcessInstanceService', ['$http', 'KieServerService', '$q', KieProcessInstanceService]);

    function KieProcessInstanceService($http, KieServerService, $q) {
        
        /** PROCESS Management Services 
        * Desc : API's to invoke KIE Process Services i.e. Start/Delete/Signal/getVariables etc...
        * Path : http://localhost:8080/kie-serverindex.html/services/rest/server/containers/{id}/processes
        */
        var processManagementURL = KieServerService.getKieServerUrl() + "/kie-server/services/rest/server/containers/" + KieServerService.getKieExecutionContainerName() + "/processes"
        
        /** PROCESS QUERY Services 
        * Desc : Query Process API's to return information around Process Definitions & Management
        * Path : http://localhost:8080/kie-serverindex.html/services/rest/server/queries
        */
        var processQueryURL = KieServerService.getKieServerUrl() + "/kie-server/services/rest/server/queries"      
        
        var service = {};

        //TODO: Add Pagination, PageSize, Status and other parameters
        // ::: MANAGEMENT PROCESS SERVICES INTERFACE ::: \\
        service.sayHello = sayHello;
        service.deleteAllProcessInstance = deleteAllProcessInstance;
        service.deleteProcessInstance = deleteProcessInstance;
        service.getProcessInstance = getProcessInstance;
        service.getProcessInstanceVariable = getProcessInstanceVariable;
        service.updateProcessInstanceVariable = updateProcessInstanceVariable;
        service.getAllProcessInstanceVariables = getProcessInstanceVariable;
        service.addNewProcessInstanceVariables = addNewProcessInstanceVariables; 
        service.startNewProcessInstance = startNewProcessInstance;
        service.startNewProcessInstanceCorrelationId = startNewProcessInstanceCorrelationId;
        service.getProcessInstanceDefinition = getProcessInstanceDefinition;
        service.getProcessInstanceSubProcesses = getProcessInstanceSubProcesses;

        
        // ::: QUERY PROCESS SERVICES INTERFACE ::: \\
        service.getAllProcessInstances = getAllProcessInstances;
        service.getAllVariablesForProcessInstance = getAllVariablesForProcessInstance;
        service.getAllProcessDefinitions = getAllProcessDefinitions;
        service.getAllProcessDefinitions = getAllProcessDefinitions;
        service.getProcessDefinition = getProcessDefinition;
        service.getProcessInstanceCorrelationId = getProcessInstanceCorrelationId; 

        return service;

        // ::: MANAGEMENT PROCESS SERVICE IMPL ::: \\
        
        function sayHello(){
            return 'Hello from the Process Service';
        }
        
        
        // DELETE :: Remove all Process instances
        function deleteAllProcessInstance(){
            return $http.delete(processManagementURL + '/instances');
        }
        
        // DELETE :: Remove specific Process instances
        function deleteProcessInstance(pInstanceId){
            return $http.delete(processManagementURL + '/instances/' + pInstanceId);
        }
        
        // GET :: Return specific Process Instance
        function getProcessInstance(pInstanceId){
            return $http.get(processManagementURL + pInstanceId);
        }
        
        // GET :: Return specific Process Instance Variables
        function getProcessInstanceVariable(pInstanceId, varName){
            return $http.get(processManagementURL + '/instances/' + pInstanceId + '/variable/' + varName);
        }
        
        // PUT :: Update Process Instance Variables
        function updateProcessInstanceVariable(pInstanceId, varName, data){
            return $http.put(processManagementURL + '/instances/' + pInstanceId + '/variable/' + varName, data);
        }
        
        // GET :: Return specific Process Instance Variables
        function getAllProcessInstanceVariables(pInstanceId){
            return $http.get(processManagementURL + pInstanceId + '/variables' );
        }
        
        // PUT :: Update Process Instance Variables
        function addNewProcessInstanceVariables(pInstanceId){
            return $http.post(processManagementURL + pInstanceId + '/variables' );
        }
        
        // POST :: Create/Start new Process Instance
        function startNewProcessInstance(processId, processVariables){
            return $http.post(processManagementURL + '/' + processId + '/instances', processVariables);
        }
        
        // POST :: Create/Start new Process Instance with Correlation Key
        function startNewProcessInstanceCorrelationId(processId, correlationKey, processVariables){
            return $http.post(processManagementURL + '/' + processId + '/instances/correlation/' + correlationKey, processVariables);
        }
        
        // GET :: Returns Process Instance Definition inc. Input/Output Variables etc.
        function getProcessInstanceDefinition(processId){
            return $http.get(processManagementURL + '/definitions/' + processId);
        }
        
        // GET :: Returns Process Instance Definition inc. Input/Output Variables etc.
        function getProcessInstanceSubProcesses(processId){
            return $http.get(processManagementURL + '/definitions/' + processId + '/subprocesses');
        }
        
        // ::: QUERY TASK SERVICES ::: \\
        
        // GET :: Return all Process Instances for a given Process ID
        function getAllProcessInstances(processId) {
            return $http.get(processQueryURL + '/processes/' + processId + '/instances?pageSize=50');
        }
        
        // GET :: Return all Process Instance Variables for a given Process ID
        function getAllVariablesForProcessInstance(processId) {
            return $http.get(processQueryURL + '/processes/instances/' + processId + '/variables/instances');
        }
        
        // GET :: Return all Process Instances for a given Process ID on a given Container
        function getAllRunningProcessInstances() {
            return $http.get(processQueryURL + '/containers/' + KieServerService.getKieExecutionContainerName()  + '/process/instances');
        }
        
        // GET :: Return all Process Definitions
        function getAllProcessDefinitions() {
            return $http.get(processQueryURL + '/processes/definitions');
        }
        
        // GET :: Return the Process Definitions for a given Process ID
        function getProcessDefinition(processId) {
            return $http.get(processQueryURL + '/processes/definitions/' + processId);
        }
        
        // GET :: Return the Process Instance for a given Correlation Key/ID
        function getProcessInstanceCorrelationId(correlationKey) {
            return $http.get(processQueryURL + '/processes/instance/correlation/' + correlationKey);
        }

    }

})();