(function () {

    "use strict";

    angular.module('patients')
        .service('patient', patient);

    patient.$inject = ['$resource', 'store'];

    /*
     * Provee comunicación con el servidor para crear, obtener, actualizar
     * y borrar información sobre pacientes.
     * Define los siquientes métodos:
     * @method create
     * @method del
     * @method update
     * @method get
     * Exporta un objeto que contiene la información del paciente:
     * @member data
     */
    function patient($resource, store) {
        /* jshint validthis:true */
        var sm = this;

        sm.data = {};
        sm.create = create;
        sm.del = del;
        sm.get = get;
        sm.update = update;

        var Patient = $resource("/paciente/:id", null, {
            'update': {method: 'PUT'},
        });

        function create (data) {
            var np = new Patient();
            angular.copy(data, np);
            np.$save();
        }

        function del (data) {
            Patient.delete({id: data.Identificacion});
            sm.data = {};
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
