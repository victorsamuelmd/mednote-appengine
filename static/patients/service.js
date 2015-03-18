(function () {

    "use strict";

    angular.module('patients')
        .service('patient', patient);

    patient.$inject = ['$resource'];

    function patient($resource) {
        var sm = this;
        sm.data = {};

        var Patient = $resource("/paciente/:id", null, {'update': {method: 'PUT'}});

        sm.create = create;
        sm.del = del;
        sm.get = get;
        sm.update = update;

        function create (data) {
            var np = new Patient();
            angular.copy(data, np);
            np.$save();
        }

        function del (data) {
            Patient.delete({id: data.Identificacion});
            angular.copy({}, data);
        }


        function get (data) {
            Patient.get({id: data.Identificacion}, function(data){
                sm.data = angular.copy(data, sm.data);
            });
        }

        function update (data) {
            Patient.update({id: data.Identificacion}, data);
        }

    }

})();
