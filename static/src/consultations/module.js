(function () {
    'use strict';

    angular.module('consultations', [
            'patients',
            'ui.router',
            'ngResource',
            'angular-storage',
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('consultation', {
                    url: '/consultation',
                    templateUrl: '/src/consultations/form.html',
                    controller: 'ConsultationsController as c'
                }
            );
    }

})();
