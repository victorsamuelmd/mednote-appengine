(function(){
    'use strict';
    angular.module('auth', ['angular-jwt', 'angular-storage', 'ui.router'])
        .config(config)

    config.$inject = ['$stateProvider'];
    
    function config($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/login',
                templateUrl: '/src/auth/login.html',
                controller: 'AuthController as vm'
            });
    }
})();
