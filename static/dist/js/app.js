(function(){
   "use strict";

    angular.module('mednote', [
            'patients',
            'consultations',
            'auth',
            'angular-jwt',
            'angular-storage'
        ])
        .config(config);

    function config(jwtInterceptorProvider, $httpProvider) {
        jwtInterceptorProvider.tokenGetter = function (store) {
            return store.get('auth_token');
        }

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();

(function(){
    'use strict';
    angular.module('auth', ['angular-jwt', 'angular-storage', 'ui.router'])
        .config(config)

    config.$inject = ['$stateProvider'];
    
    function config($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/login',
                templateUrl: '/src/auth/login.html',
                controller: 'AuthController as vm'
            });
    }
})();

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

(function () {
   "use strict";

    angular.module('patients', ['ngResource', 'ui.router', 'angular-storage', 'angular-jwt'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('patient', {
                    url: '/patient/create',
                    templateUrl: '/src/patients/form.html',
                    controller: 'PatientsController as vm',
                }
            );
       
    }

})();

(function () {
    'use strict';
    
    angular.module('auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$http', 'jwtHelper', 'store'];

    function AuthController ($http, jwtHelper, store) {
        var tokenObject;
        var vm = this;
 
        vm.username = null;
        vm.password = null;
        vm.error = null;
        vm.login = login;
        vm.verifyToken = verifyToken;
        vm.waiting = false;
        vm.logup = logup;
        vm.logout = logout;

        function login() {
            vm.waiting = true;
            $http.post('/login', {username: vm.username, password: vm.password})
                .success(success)
                .error(function (data, status, headers, config) {
                    vm.waiting = false;
                    if (status == 404) {
                        vm.error = 'User does not exist or password invalid';
                    }
                });
        }

        function verifyToken() {
            console.log(store.get('auth_token'));
        }

        function logup() {
            $http.post('/logup', {
                username: vm.username, password: vm.password, auth_level: "admin"})
                .success(success)
                .error(function (data, status, headers, config) {
                    vm.waiting = false;
                    vm.error = 'Could not create the user because' + data.error;
                });
        }

        function logout() {
            store.remove('auth_token');
            store.remove('user');
        }
        
        function success(data, status, headers, config) {
                    tokenObject = jwtHelper.decodeToken(data.authorization);
                    store.set('auth_token', data.authorization);
                    store.set('user', tokenObject);
                    vm.error = null;
                    vm.waiting = false;
        }
    }
    
}());

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

        $scope.$watchCollection(function(){return patient.data;}, function (newv, old) {
            vm.data = newv;
        });
    }

})();

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
