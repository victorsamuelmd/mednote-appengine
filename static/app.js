(function(){
   "use strict";

    angular.module('mednote', [
            'patients',
            'consultations',
            'auth',
            'angular-jwt',
            'angular-storage'
        ])
        .config(config);

    function config(jwtInterceptorProvider, $httpProvider) {
        jwtInterceptorProvider.tokenGetter = function (store) {
            return store.get('auth_token');
        }

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();
