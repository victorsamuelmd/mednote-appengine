(function () {
    "use strict";

    angular.module('patients')
        .controller('PatientsController', PatientsController);

    PatientsController.$inject = (["patientsService", '$scope']);

    function PatientsController (patientsService, $scope) {

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
