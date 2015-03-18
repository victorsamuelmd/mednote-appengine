(function () {
    'use strict';
    angular.module('consultations')
        .controller('ConsultationsController', ConsultationsController);

    function ConsultationsController(patient, $scope, $resource) {
        var vm = this;
        var Consulta = $resource('/consulta/:id', {});

        vm.data = {'usuario': patient.data.Identificacion};
        vm.patient = angular.copy(patient.data);
        vm.create = create;
        
        function create(){
            var c = new Consulta();
            angular.extend(c, vm.data);
            c.$save();
        }

/*        $scope.$watchCollection(function(){return patient.patient}, function (newv, old) {
            vm.patient = newv;
            vm.data.usuario = vm.patient.Identificacion;
        });*/
    }

    ConsultationsController.$inject = ['patient', '$scope', '$resource'];
})();
