angular.module('citiClientOnboarding').factory('StateStore', function () {
    var currentTask;
    // var currentCase;
    var savedProcesses;

    var getCurrentTask = function () {
        return currentTask;
    };

    var setCurrentTask = function (id) {
        currentTask = id;
    };

    // var getCurrentCase = function () {
    //     return currentCase;
    // };

    // var setCurrentCase = function (process) {
    //     currentCase = process;
    // };

    var setSavedProcesses = function (processes) {
        savedProcesses = processes;
    };

    // search list of processes and return based on input process-instance-id
    var getCurrentProcess = function (caseID) {
        // check savedProcesses exist first
        if(savedProcesses){
            for (var i = 0; i < savedProcesses.length; i++) {
                if (savedProcesses[i][['process-instance-id']].toString() === caseID){
                    return savedProcesses[i];
                }
            }
        }

        // return null if nothing found
        return null;
    };

    var saveCurrentProcess = function (caseID, process) {
        // check savedProcesses exist first
        if(savedProcesses){
            for (var i = 0; i < savedProcesses.length; i++) {
                if (savedProcesses[i][['process-instance-id']].toString() === caseID){
                    console.log('HEYHEYHEY');
                }
            }
        }
    };


    return {
        getCurrentTask: getCurrentTask,
        setCurrentTask: setCurrentTask,
        // getCurrentCase: getCurrentCase,
        // setCurrentCase: setCurrentCase,
        setSavedProcesses: setSavedProcesses,
        getCurrentProcess: getCurrentProcess
    };

});