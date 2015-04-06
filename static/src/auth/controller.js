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
