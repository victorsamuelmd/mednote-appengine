(function () {
    "use strict";

    angular.module('patients')
        .controller('PatientsController', PatientsController);

    PatientsController.$inject = (["patient", '$scope']);

    function PatientsController (patient, $scope) {

        var vm = this;

        vm.data = {};
        vm.create = create;
        vm.del = del;
        vm.get = get;
        vm.update = update;
        
        function get(){
            patient.get(vm.data);
        }
        
        function create(){
            patient.create(vm.data);
        }

        function del() {
            patient.del(vm.data);
        }

        function update() {
            patient.update(vm.data);
        }

        $scope.$watchCollection(function(){return patient.data}, function (newv, old) {
            vm.data = newv;
        });
    }

})();
