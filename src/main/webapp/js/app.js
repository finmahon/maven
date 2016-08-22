angular.module('citiClientOnboarding', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'formly', 'formlyBootstrap', 'datatables']);

// Application Routing and Controller Declarations
angular.module('citiClientOnboarding').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
    // Home
    .when('/', {
        templateUrl: 'partials/home.html', 
        controller: "HomeController"
    }).when('/cases', {
        templateUrl: 'partials/cases.html', 
        controller: "CaseController"
    }).when('/new', {
        templateUrl: 'partials/new.html', 
        controller: "CreateCaseController"
    }).when('/reports', {
        templateUrl: 'partials/reports.html', 
        controller: "ReportController"
    }).when('/cases/:CASE', {
        templateUrl: 'partials/case-view.html', 
        controller: "CaseDashboardController"
    });

}]);


// Inject Custom Interceptor into httpProvider 
angular.module('citiClientOnboarding').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('KieInterceptor');
}]);

angular.module('citiClientOnboarding').run(['$document',function($document) {
    //set default page length for datatables
    $document.ready(function(){
         $.extend( $.fn.dataTable.defaults, {
            "pageLength": 10
        });
    });
}]);

