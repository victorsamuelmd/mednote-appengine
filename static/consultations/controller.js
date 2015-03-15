(function () {
    "use strict";

    angular.module('consultations')
        .controller('ConsultationsController', ConsultationsController);

    function ConsultationsController(patientsService, $scope, $resource) {
        var vm = this;
        vm.data = {};

        var Consulta = $resource('/consulta/:id', {});

        vm.patient = patientsService.patient;

        vm.create = function create(){
            var c = new Consulta();
            angular.extend(c, vm.data);
            c.$save();
        }

        $scope.$watchCollection(function(){return patientsService.patient}, function (newv, old) {
            vm.patient = newv;
            vm.data.usuario = vm.patient.Identificacion;
        });
    }

    ConsultationsController.$inject = ["patientsService", '$scope', '$resource'];

})();
