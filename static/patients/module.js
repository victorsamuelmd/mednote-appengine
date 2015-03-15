(function () {
   "use strict";

    angular.module('patients', ['ngResource', 'ui.router'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('patient', {
                    url: '/patient/create',
                    templateUrl: '/static/patients/form.html',
                    controller: 'PatientsController as patient',
                }
            );

    }

})();
