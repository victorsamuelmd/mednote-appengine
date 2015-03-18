(function(){
    'use strict';
    describe("PatientsController", function () {
        beforeEach(module('patients'));

        var $controller, $httpBackend, controller, patient, $rootScope;

        beforeEach(inject(function (_$controller_, _$httpBackend_, _patient_, _$rootScope_) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            patient = _patient_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function () {
            controller = $controller('PatientsController', {$scope: $rootScope});
            controller.data = {"Identificacion": 1087998004};
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('send an http GET request to the server', TestGetPatient);
        it('Sends an http POST request to the server', TestCreatePatient);
        it('sends an http DELETE request to the server', TestDeletePatient);
        it('should send an http GET request and populate the model', TestGetAndPopulate);

        function TestGetPatient() {
            $httpBackend.expectGET('/paciente/1087998004')
                .respond(200, {});
            controller.get();
            $httpBackend.flush();
        }

        function TestCreatePatient() {
            $httpBackend.expectPOST('/paciente')
                .respond(201, {});
            controller.create();
            $httpBackend.flush();
        }

        function TestDeletePatient() {
            $httpBackend.expect('DELETE', '/paciente/1087998004')
                .respond(200);
            controller.del();
            $httpBackend.flush();
        }

        function TestGetAndPopulate() {
            $httpBackend.when('GET', '/paciente/1087998004')
                .respond(200, {'Identificacion': 1087998004, 'Nombres': 'Victor Samuel', 'PrimerApellido': 'Mosquera'});
            controller.get();
            $httpBackend.flush();
            expect(patient.data.Nombres).toBe('Victor Samuel');
            expect(patient.data.PrimerApellido).toBe('Mosquera');
        }
    });
})();
