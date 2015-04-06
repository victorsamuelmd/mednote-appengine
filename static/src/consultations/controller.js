(function () {
    'use strict';
    angular.module('consultations')
        .controller('ConsultationsController', ConsultationsController);

    function ConsultationsController(patient, $scope, $resource, store) {
        var vm = this;
        var Consulta = $resource('/consulta/:id', {});

        vm.data = patient.data;
        vm.create = create;
        vm.data.user = store.get('user');
        
        function create(){
            var c = new Consulta();
            angular.extend(c, vm.data);
            c.$save();
        }
    }

    ConsultationsController.$inject = ['patient', '$scope', '$resource', 'store'];

})();
