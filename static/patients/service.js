(function () {

    "use strict";

    angular.module('patients')
        .service('patientsService', patientsService);

    patientsService.$inject = ['$resource'];

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

})();
