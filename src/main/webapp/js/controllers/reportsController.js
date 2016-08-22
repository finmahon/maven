angular.module('citiClientOnboarding').controller('ReportController', 
        ['$scope', 'formlyConfig', '$timeout', 
        function($scope, formlyConfig, $timeout){

    $scope.sprintName = "Sprint 3";
    $scope.sprintDesc = "Learn directives";
    $scope.contactState = 'view';
    $scope.addContactError = {};
    $scope.addContactError.state = false;
    
    // Handle all Contact Operations
    $scope.contactOperation = function(val){   
        if (val === 'add'){
            if ($scope.contacts.length >= 3){
                $scope.addContactError.state = true;
                $scope.addContactError.message = "no more contacts can be added please remove a contact to add a new 1 !!";
                // Display Error Message for 3 seconds
                $timeout(function() {
                    $scope.addContactError.state = false;
                    $scope.addContactError.message = {};
                }, 5000)
                
                $scope.addContactError.state = true;
                return;
            } else {
                $scope.currentContact = {};
            }
        }
        
        // Reset focus if object is null 
         if (val === 'view' && Object.keys($scope.currentContact).length == 0){
             $scope.focusOnContact($scope.contacts[0]);
         }
        
        $scope.contactState = val;
    }
    
    $scope.addContact = function(){
        $scope.contactState = 'add';
    }
            
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    vm.exampleTitle = 'UI Bootstrap Datepicker'; // add this

    vm.model = {};
    vm.options = {};

    vm.fields = [
      {
        key: 'text1',
        type: 'datepicker',
        templateOptions: {
            label: 'Driver\'s License Number',
            placeholder: 'Enter your drivers license number',
            disabled: false,
            required: true,
        }
      },
      {
        key: 'date1',
        type: 'datepicker',
        templateOptions: {
          label: 'Date 1',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      },
      {
        key: 'checkbox',
        type: 'checkbox',
        templateOptions: {
          label: 'Disable Date 2',
        }
      },
      {
        key: 'date2',
        type: 'datepicker',
        templateOptions: {
          label: 'Date 2',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.checkbox'
        }
      }
    ];
            
    $scope.focusOnContact = function(contact){
        $scope.currentContact = contact;
    }

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
      vm.options.updateInitialValue();
      alert(JSON.stringify(vm.model), null, 2);
    }
            
  // contact list, usually would be a separate database
  $scope.contacts = [
    {id: 0, name: 'Ned Stark', email: 'ned@winterfell.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Winter is coming.'},
    {id: 1, name: 'Theon Greyjoy', email: 'tgreyjoy@winterfell.com', phone: '123-123-123', url: 'www.google.com', notes: 'Reluctant to pay iron price.'}
  ];
    
    if ($scope.contacts.length == 0){
        $scope.contactOperation('add');
    }  
      $scope.currentContact = $scope.contacts[0];      
    
            
}]);

// directives
angular.module('citiClientOnboarding').directive('contact', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'contact.html'
  }
});

angular.module('citiClientOnboarding').directive('viewContact', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'view-contact.html'
  }
});

angular.module('citiClientOnboarding').directive('editContact', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'edit-contact.html'
  }
});