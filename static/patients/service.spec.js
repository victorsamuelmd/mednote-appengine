(function(){
    'use strict';
    describe('patient', function () {
        beforeEach(module('patients'));

        var patient, $httpBackend;

        beforeEach(inject(function (_$httpBackend_, _patient_) {
            $httpBackend = _$httpBackend_;
            patient = _patient_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should send an http POST request to the server', TestPostPatient);
        it('should send and http DELETE request to the server', TestDeletePatient);
        it('should get data from the http GET request and populate a data object', TestGetAndPopulate);
        it('should send an http POST request to create a new patient', TestCreatePatient);
        it('should sent an http PORT request to update a existing patient', TestUpdatePatient);

        function TestPostPatient() {
            patient.data = {"Identificacion": 1087998004};

            $httpBackend.expectGET('/paciente/1087998004')
                .respond(200, {Nombres: 'Victor Samuel', Identificacion: 1087998004});
            
            patient.get(patient.data);

            $httpBackend.flush();
        }

        function TestDeletePatient() {
            patient.data = {"Identificacion": 1098641535};

            $httpBackend.expect('DELETE', '/paciente/1098641535')
                .respond(200, {});

            patient.del(patient.data);

            $httpBackend.flush();
        }

        function TestGetAndPopulate() {
            $httpBackend.when('GET', '/paciente/1087998004')
                .respond(200, {"Identificacion": 1087998004, 'Nombres': 'Victor Samuel', 'PrimerApellido': 'Mosquera'});
            
            patient.data = {'Identificacion': 1087998004}
            patient.get(patient.data);
            $httpBackend.flush();

            expect(patient.data.Nombres).toBe('Victor Samuel');
            expect(patient.data.PrimerApellido).toBe('Mosquera');
        }


        function TestCreatePatient() {
            $httpBackend.expectPOST('/paciente')
                .respond(201);

            patient.data = {'Identificacion': 1087998004, 'Nombres': 'Victor Samuel', 'PrimerApellido': 'Mosquera'}

            patient.create(patient.data);

            $httpBackend.flush();
        }

        function TestUpdatePatient() {
            $httpBackend.expect('PUT', '/paciente/1087998004')
                .respond(200);
            patient.data = {'Identificacion': 1087998004, 'Nombres': 'Victor Samuel', 'PrimerApellido': 'Mosquera'}
            patient.update(patient.data);
            $httpBackend.flush();
        }
    });
})();
