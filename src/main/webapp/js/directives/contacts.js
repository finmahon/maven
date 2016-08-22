angular.module('citiClientOnboarding').directive('contacts', ['KieProcessInstanceService','$timeout','Constants',
    function (KieProcessInstanceService, $timeout, Constants) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
        contacts: '=',
        pid: '='
      },
    templateUrl: 'partials/directives/contacts.html',
    link: function ($scope) {


      function resetInput() {
        $scope.name="";
        $scope.position="";
        $scope.phone="";
        $scope.email="";
      }

      if (!$scope.contacts){
        $scope.contacts = [];
      }

      $scope.addingContact = true;
      $scope.editCtrl = [];
      $scope.newInput=true;

      $scope.contactPositions = Constants.caseContactPositions;

      $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
      $scope.numberFormat = /^[0-9()+-]+$/;
  
      resetInput();

      for (var i = 0; i < $scope.contacts.length; i++) {
        $scope.editCtrl.push(
            _.chain($scope.contacts[i])
            .clone()
            .assign({
                edit: false,
                expand: false
                })
            .value()
        );
      }

      $scope.toggleExpand = function(idx){
        $scope.editCtrl[idx].expand = !$scope.editCtrl[idx].expand;
      };

      $scope.togggleEdit = function(idx){
        $scope.editCtrl[idx].edit = !$scope.editCtrl[idx].edit;
      };

      $scope.cancel = function(idx){
        $scope.editCtrl[idx].edit = false;
        $scope.editCtrl[idx].expand = false;
        $scope.editCtrl[idx].name = $scope.contacts[idx].name;
        $scope.editCtrl[idx].position = $scope.contacts[idx].position;
        $scope.editCtrl[idx].phone = $scope.contacts[idx].phone;
        $scope.editCtrl[idx].email = $scope.contacts[idx].email;
      };

      $scope.remove = function(idx){
        _.pullAt($scope.editCtrl, idx);
        _.pullAt($scope.contacts, idx);
        if ($scope.contacts.length <= 0){
          $scope.newInput= true;
        }
      };

      $scope.saveInput = function(idx){
        if ($scope.editContactForm.$invalid ) {
          $scope.contactEditError = true;
          $timeout(function() {
              $scope.resetError();
            }, 4000);
        } else {
          $scope.editCtrl[idx].edit = false;
          $scope.editCtrl[idx].expand = false;
          $scope.contacts[idx].name = $scope.editCtrl[idx].name;
          $scope.contacts[idx].position = $scope.editCtrl[idx].position;
          $scope.contacts[idx].phone = $scope.editCtrl[idx].phone;
          $scope.contacts[idx].email = $scope.editCtrl[idx].email;
          //only save to backend when in case homepage
            if ($scope.pid){
              saveCurrentCaseVariable('contacts', $scope.contacts);
            }
        }
      };

      $scope.addNew = function(){
        if ($scope.contacts.length >= 3 ) {
            $scope.contactNumError = true;
            $scope.errorMsg = "Maximum of 3 Contacts Permitted";
            $timeout(function() {
              $scope.resetError();
            }, 4000);
        } else {
            $scope.newInput = true;
        }
      };

      $scope.saveNew = function(){
        if ($scope.nowContactForm.$invalid ) {
            $scope.contactError = true;
            // $scope.errorMsg = "Must Enter Contact Name";
            $timeout(function() {
              $scope.resetError();
            }, 4000);
        } else {
            $scope.contacts.push({
                name: $scope.name,
                position: $scope.position,
                phone: $scope.phone,
                email: $scope.email,
            });

            $scope.editCtrl.push({
                name: $scope.name,
                position: $scope.position,
                phone: $scope.phone,
                email: $scope.email,
                edit: false,
                expand: false
            });

            resetInput();
            $scope.newInput = false;

            //only save to backend when in case homepage
            if ($scope.pid){
              saveCurrentCaseVariable('contacts', $scope.contacts);
            }
          }
      };

      $scope.resetError = function(){
        $scope.contactError = false;
        $scope.contactNumError = false;
        $scope.contactEditError = false;
        $scope.contactError = "";
      };

     function saveCurrentCaseVariable (varName, value) {
          console.log('saving variable ', varName, value);
          KieProcessInstanceService.updateProcessInstanceVariable($scope.pid, varName, JSON.stringify(value)).then(function (response) {
              console.log('Succesfully saved variable : ' + varName + ':' + value +' to process '+$scope.pid);

          }, function (response) {
              // Failed To Retrieve Processes throw error message
              console.log('Error saving variable : ' + varName + ':' + value + 'error:' + JSON.stringify(response.data));
          });
      }

     

    }
  };
}]);
