(function(){
    'use strict';
    describe('AuthController', function () {
        beforeEach(module('auth'));

        var username = faker.name.firstName();
        var password = faker.internet.password();

        var AuthController, $controller, $httpBackend, $scope, $http, store;
        var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX2xldmVsIjoiYWRtaW4iLCJ1c2VybmFtZSI6InZpY3RvcnNhbXVlbG1kIn0.Gi-CheElgh-kZ05SisQv1t7rEMU53Y1MD1DdnskMId5hum9BBJpqPGJCeMefQVBAylfo-HoVKvXAtNzHOw6krL69dCurHlc9W3jDVmIMvvt_mzRCOGwyOdmVDLYyvpHkOvLC9yYs0sdkwNIl5fZq3TpRdG-exk5IXIMm_Zl5xY4';

        beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, _$http_, _store_) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $scope = _$rootScope_;
            $http = _$http_;
            store = _store_;
        }));

        beforeEach(function () {
            AuthController = $controller('AuthController', {$scope: $scope});
            AuthController.username = username;
            AuthController.password = password;
        });
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should send a post request with the username and password', TestLogin);
        it('should assing an error when username and password not match', TestErrorMessage);

        function TestLogin() {
            store.remove('user');
            $httpBackend.expectPOST('/login', {username: username, password: password})
                .respond(200, {authorization: token});

            AuthController.login();
            $httpBackend.flush();

            expect(store.get('user')).not.toBe(null)
        }

        function TestErrorMessage() {
            store.remove('user');
            $httpBackend.whenPOST('/login')
                .respond(404);
            AuthController.login();
            $httpBackend.flush();

            expect(AuthController.error).not.toBe(null);
            expect(store.get('user')).toBe(null);
        }
    });

})();
