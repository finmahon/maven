angular.module('citiClientOnboarding').controller('ModalTaskView',
    ['$scope', '$modalInstance', 'TaskFormGeneratorService', 'Constants', 'KieTaskManagementService', 'currentTask',
    function ($scope, $modalInstance, TaskFormGeneratorService, Constants, KieTaskManagementService, currentTask) {
    
    $scope.currentTask = currentTask;

    var parsedForm;
    var vm = this;
    
    // create comment filed for formly
    var commentField = {
      key: 'comment',
      type: 'textAreaComment',
      templateOptions: {
        charlength: Constants.commentMaxLength || 250,
        type: 'text'
      },
      link: function limitText (scope, elem, attrs) {
        var limit = Constants.commentMaxLength;
        elem.on("keypress", function(e) {
          var key;
          if (e.which === null) { //IE
            key = e.keyCode;
          }
          if (e.which !== 0) { // all but IE
            key = e.which;
          }
          if (scope.model.comment && scope.model.comment.length >= limit && (key != 8 && key !== 46)) {
            e.preventDefault();
          }
        });
      }
    };


    if (currentTask) {
      // set up input from task form
      getTaskForm(currentTask);
    } else {
      // just set up to get somment
      vm.fields = [];
      vm.fields.push(commentField);
      vm.model={};
      vm.title = "Enter Case Comment";
      
    }

    $scope.modalCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.submitForm = function () {
        $modalInstance.close(vm.model);
    };
        
    
    function  parseForm(form){
      parsedForm = TaskFormGeneratorService.generateTaskForm(form);
      vm.fields = parsedForm.fields;
      vm.fields.push(commentField);
      vm.model={};
      vm.title = parsedForm.title;
    }
    
   // Perform Task Operations & refresh Task Instance List
   function getTaskForm  (tInstanceId) {
       KieTaskManagementService.getTaskForm(tInstanceId).then(function (response) {
          console.log('back from getForm');
          parseForm(response.data);

       }, function (err) {
           console.log('Failed to get form for' + tInstanceId +' - ' + JSON.stringify(err));
       });
   }

}]);