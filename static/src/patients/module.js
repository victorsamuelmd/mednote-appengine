(function () {
   "use strict";

    angular.module('patients', ['ngResource', 'ui.router', 'angular-storage', 'angular-jwt'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('patient', {
                    url: '/patient/create',
                    templateUrl: '/src/patients/form.html',
                    controller: 'PatientsController as vm',
                }
            );
       
    }

})();
