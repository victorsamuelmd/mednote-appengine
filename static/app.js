(function(){
    "use strict";

    var medNote = angular.module('mednote', ["ngResource"]);

    medNote.service('patientsService', patientsService);
    medNote.controller('patients', patients);
    medNote.controller('consultaController', consultaController);

    function patientsService($resource) {
        var sm = this;
        this.patient = {};

        var Patient = $resource("/paciente/:id", {id:'@id'}, {});

        this.create = create; 
        this.del = del;
        this.get = get;
        this.update = update;

        function create (data) {
            var np = new Patient();
            angular.extend(np, data);
            np.$save();
        }

        function del (data) {
            Patient.delete({id: data.Identificacion});
        }


        function get (data) {
            Patient.get({id: data.Identificacion}, function(d){
                sm.patient = d;
            });
        }

        function update () {
            Patient.get({id: vm.data.Identificacion}, function(data){
                var patient = vm.data;
                patient.$save({id: vm.data.Identificacion}); 
            });
        }

    }

    function consultaController(patientsService, $scope, $resource) {
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


    consultaController.$inject = ["patientsService", '$scope', '$resource'];
    patients.$inject = (["patientsService", '$scope']);


    function patients (patientsService, $scope) {

        var vm = this;

        vm.get = function get(){
            patientsService.get(vm.data);
        }

        vm.create = function create(){
            patientsService.create(vm.data);
        }

        $scope.$watchCollection(function(){return patientsService.patient}, function (newv, old) {
            vm.data = newv;
        });

    }
})();
