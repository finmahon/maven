/**
 * Created by ajarrett : ajarrett@redhat.com on 20/07/16.
 * HTTP Request Interceptor for KIE Specific Headers
 */

angular.module('citiClientOnboarding').factory('KieInterceptor', ['$log', function($log) {  
    $log.debug('Appending KIE specific headers to request');
    
    var KieInterceptor = {
        request: function(config) {
                    /* Attaches Accept, Content-Type & Hardcoded Auth Headers to all Requests */
                    config.headers['Authorization'] = 'Basic dXNlcjE6cGFzc3dvcmQxIQ==';
                    config.headers['Accept'] = "application/json";
//                    config.headers['Content-type'] = "application/json";
//                    config.headers['Access-Control-Allow-Origin'] = "*";
//                    config.headers['Access-Control-Allow-Credentials'] = "true";
//                    config.headers['Access-Control-Allow-Methods'] = "GET, PUT,POST";
//                    config.headers['Access-Control-Allow-Headers'] = "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With";
                
                return config;
            }   
        };

    return KieInterceptor;

}]);    