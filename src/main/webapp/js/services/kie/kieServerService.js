/**
 * Created by ajarrett : ajarrett@redhat.com on 18/07/16.
 * Kie Process Instance Management Status Service
 */

(function () {
    'use strict';

    angular.module('citiClientOnboarding')
        .factory('KieServerService', ['Constants', KieServerService]);
    
    function KieServerService(Constants) {      
        
        var service = {};
        
        // ::: MANAGEMENT PROCESS SERVICES INTERFACE ::: \\
        service.getKieServerUrl = getKieServerUrl;
        service.getKieExecutionContainerName = getKieExecutionContainerName;
        service.getKieExecutionDemoContainerName = getKieExecutionDemoContainerName;
        service.getKieCitiNTBProcessID = getKieCitiNTBProcessID;
        service.getKieDemoProcessID = getKieDemoProcessID;
        service.getKieDemoUser = getKieDemoUser;
        service.getKieDemoGroup = getKieDemoGroup;


        return service;

        // ::: MANAGEMENT PROCESS SERVICE IMPL ::: \\
        
        // Return KIE Container Server HOST/Part URL
        function getKieServerUrl(){
             return "http://" + Constants.ENV.kieserver_host + ":" + Constants.ENV.kieserver_port;
        }
        
        // Return CITI KIE Container Instance name
        function getKieExecutionContainerName(){
             return Constants.ENV.kieserver_citi_containerId;
        }
        
        // Return Demo KIE Container Instance name
        function getKieExecutionDemoContainerName(){
             return Constants.ENV.kieserver_containerId;
        }
        
        // Return Kie Demo Process ID
        function getKieCitiNTBProcessID(){
            return Constants.ENV.kieserver_ntb_processId;
        }
        
        // Return Kie Demo Process ID
        function getKieDemoProcessID(){
            return Constants.ENV.kieserver_processId;
        }

        // Return Kie Demo Process ID
        function getKieDemoUser(){
            return Constants.ENV.kieserver_user;
        }

        // Return Kie Demo Process ID
        function getKieDemoGroup(){
            return Constants.ENV.kieserver_group;
        }
    }

})();