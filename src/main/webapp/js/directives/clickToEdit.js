angular.module('citiClientOnboarding').directive('clickToEdit',['$timeout', function($timeout) {
    return {
        scope: {
            model: '=ngModel',
            type: '@type',
            varname: '@varName',
          
            saveCurrentCase: '&saveCurrentCase'
        },
        replace: true,
        transclude: false,
        // includes our template
        templateUrl: 'partials/directives/clickToEdit.html',
        link: function (scope, element, attrs) {
            scope.editState = false;

            // make a local ref so we can back out changes, this only happens once and persists
            scope.localModel = scope.model;

            // apply the changes to the real model
            scope.save = function(){
                scope.model = scope.localModel;
                scope.toggle();
                console.log('varName/value', scope.varname, scope.model)
                scope.saveCurrentCase({varName: scope.varname, value:scope.model});
            };

            // don't apply changes
            scope.cancel = function(){
                scope.localModel = scope.model;
                scope.toggle();
            };

            /*
             * toggles the editState of our field
             */
            scope.toggle = function () {

                scope.editState = !scope.editState;

                /*
                 * a little hackish - find the "type" by class query
                 */
                var x1 = element[0].querySelector("."+scope.type);

                /*
                 * could not figure out how to focus on the text field, needed $timout
                 * http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field-in-angularjs
                 */
                $timeout(function(){
                    // focus if in edit, blur if not. some IE will leave cursor without the blur
                    if (scope.editState) {
                        x1.focus();
                    } else {
                        x1.blur();
                    }

                }, 0);
            };
        }
    };
}]);
