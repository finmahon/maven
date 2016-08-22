angular.module('citiClientOnboarding').controller('CreateCaseController', 
        ['$scope', '$http', 'filterFilter', '$q', '$timeout', 'KieServerService', 'KieProcessInstanceService', '$log', '$filter', 'Constants',
        function($scope, $http, filterFilter, $q, $timeout, KieServerService, KieProcessInstanceService, $log, $filter, Constants) {
    
    $scope.data = { };
    // $scope.contacts = [
    //     {id: 0, name: 'Ned Stark', position: "Chairman of the Board (CHB)", email: 'ned@winterfell.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Winter is coming.'},
    //     {id: 1, name: 'Theon Greyjoy', position: "Chairman of the Board (CHB)", email: 'tgreyjoy@winterfell.com', phone: '123-123-123', url: 'www.google.com', notes: 'Reluctant to pay iron price.'}
    //   ];
    
    // Accounts List 
    $scope.accounts = [];
    $scope.form = {};
    // Set DatePicker to Todays Date formatted to American Style Dates.. 
    $scope.form.caseGFCIDRequestDate = $filter('date')(new Date(), 'MM/dd/yyyy');

    // Constants dropdown field values
    $scope.caseTypes = Constants.caseTypes;
    $scope.accountNames = Constants.accountNames;
    $scope.accountTypes = Constants.accountTypes;
    $scope.accountProducts = Constants.accountProducts;
            
    // selected products
    $scope.selection = [];
    
    // helper method to get selected accounts products
    $scope.selectedProducts = function selectedProducts() {
        return filterFilter($scope.accountProducts, { selected: true });
    };
    
    // watch accountProducts for changes
    $scope.$watch('accountProducts|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (accountProducts) {
            return accountProducts.name;
        });
    }, true);
    
    // Add 
    $scope.addRow = function(){
        if ($scope.accountsForm.$invalid ) {
            $scope.accountError = true;
            $scope.accountError = "Must Enter All Account Details to create account";
            $timeout(function() {
              $scope.resetError();
            }, 4000);
        } else if ($scope.accounts.length >= 5 ) {
            $scope.accountError = true;
            $scope.accountError = "Maximum of 5 Accounts allowed. Delete existing account before assind another";
            $timeout(function() {
              $scope.resetError();
            }, 5000);
        } else {
            $scope.accounts.push({ 'name':$scope.accountName,
                                    'branch': $scope.accountBranch,
                                    'currency':$scope.accountCurrency,
                                    'type':$scope.accountType,
                                    'products':$scope.selection
                                  });
            // Reset Field Values
            $scope.accountName='';
            $scope.accountBranch='';
            $scope.accountCurrency='';
            $scope.accountType='';
            $scope.selection = [];

            // Reset Product Checkbox Values 
            angular.forEach($scope.accountProducts, function(prods){
               prods.selected = false;
            });
        }
    };

    $scope.isAccCheckboxValid = function(){
      return !$scope.accountProducts.some(function(options){
        return options.selected;
      });
    }
    $scope.resetError = function(){
        $scope.accountError = false;
        $scope.onboardAccError = false;
        $scope.onboardError = false;
        $scope.accountError = "";
      };
    
    // Remove Accounts that are selected n Accounts Requested table
    // This is an Array Copy method, I dont like it I'd prefer to use nv-map here. 
    $scope.removeRow = function(){
        var newDataList=[];
        $scope.selectedAllAccounts = false;
        angular.forEach($scope.accounts, function(selected){
            if(!selected.selected){
                newDataList.push(selected);
            }
        });
        $scope.accounts = newDataList;
    };
    
    // Checkall Accounts in Accounts Requested table
    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAllAccounts = true;
        } else {
            $scope.selectedAllAccounts = false;
        }
        angular.forEach($scope.accounts, function (accounts) {
            accounts.selected = $scope.selectedAllAccounts;
        });
    };
            
/*      PROCESS DEFINITION - NTB:
        - "process-id": "com.citi.onboarding.ntb.new-to-business",
        - "process-name": "new-to-business",
        - "package": "com.citi.onboarding.ntb",
        - "container-id": "citi_onboarding"
*/
/*      PROCESS VARIABLES:
        * Case Type
        * Case ID - <Case Type Accronym><YYMMDD><Process Instance ID>
        * Company Name
        * Country Code
        * Agreement to Proceed
        * Case Company Profile
            - Name
            - Position
            - Email
            - Phone Number
        * GFCID Request Date
        * GFCID
        * CASE-ID == process-id
        * Account(s)
            - Name 
            - Branch
            - Currency
            - Account Type
            - Product(s)
*/
    $scope.createNewProcessInstance = function () {

        if($scope.onboardForm.$invalid){
            $scope.onboardError = true;
            $scope.onboardError = "Must Enter Case Type and Company Name";
            $timeout(function() {
              $scope.resetError();
            }, 4000);

        } else if($scope.accounts.length <= 0){
            $scope.onboardAccError = true;
            $scope.onboardError = "Must Enter at least one account";
            $timeout(function() {
              $scope.resetError();
            }, 4000);

        } else {
        
           // TEMP Add some values until Auth/SSO is sorted.
            var processVariables = $scope.form;
            processVariables.GFCID = 'TBD';
            processVariables.countryCode = 'UK';
            processVariables.casemanagerRole = 'casemanager-rus';
            processVariables.contacts = $scope.contacts;
            
            /*  Define Case ID <CaseTypeID><Date><ProcessInstanceID>
                Process InstanceID will be updated after the POST. 
            */
            var caseTypeID = processVariables.caseType;
            processVariables.caseID = caseTypeID.id + '-' + $filter('date')(new Date(), 'yyMMdd') + '-';
            processVariables.caseType = caseTypeID.desc;

            if ($scope.accounts.length >= 1) {
                processVariables.accounts = $scope.accounts;
            }

            // POST the New Case 
            KieProcessInstanceService.startNewProcessInstance(KieServerService.getKieCitiNTBProcessID(), processVariables).then(function (response) {
                $log.debug('Succesfully created Process Instance/New Case with ID: ' + response.data);
                $scope.data.result = response.data;
            }, function (response) {
                // Failed To Retrieve Processes throw error message
                $log.error('Failed to create Process Instance/New Case data with reponse: ' + JSON.stringify(response.data));
                $scope.data.error = {};
                $scope.data.error.code = 'createProcess';
                $scope.data.error.message = 'The new Case could not be created. Please contact your administrator';
            }).finally(function () {
                // Update CASEID Var with Created Process Instance ID...
                // processVariables.caseID += $scope.data.result;
                // updateProcessInstanceCaseID($scope.data.result, processVariables.caseID);
                // $scope.data.result = processVariables.caseID;
            });
        }
    };
    
    function updateProcessInstanceCaseID(pInstID, caseIDValue) {
        $log.debug('UPDATING: process instance: ' + pInstID + ' with CaseID: ' + caseIDValue);
        KieProcessInstanceService.updateProcessInstanceVariable(pInstID, 'caseID', JSON.stringify(caseIDValue)).then(function (response) {
            $log.debug('Succesfully updated CaseID to: ' + caseIDValue + ' with reponse: ' + response.status);
            deferred.resolve(response);
        }, function (response) {
            // Failed To Retrieve Processes throw error message
            $log.error('Failed to update Process Instance CaseID with reponse: ' + JSON.stringify(response.data));
        });
    }
    
    // Reset Data & Form vars
    $scope.reload = function () {
        // Re-Initialise Form and reset date...
        $scope.form = {};
        $scope.form.caseGFCIDRequestDate = $filter('date')(new Date(), 'MM/dd/yyyy');
        $scope.data = {};
    };

}]);

