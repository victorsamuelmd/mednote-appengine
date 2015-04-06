(function(){
    'use strict';
    describe('patient', function () {
        beforeEach(module('patients'));

        faker.locale = 'es';
        var patient, $httpBackend;

        var data = {
            Identificacion: faker.finance.account(),
            Nombres: faker.name.firstName(),
            PrimerApellido: faker.name.lastName(),
            SegundoApellido: faker.name.lastName(),
        }

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
        it('should sent an http POST request to update a existing patient', TestUpdatePatient);

        function TestPostPatient() {
            patient.data = data;

            $httpBackend.expectGET('/paciente/' + data.Identificacion)
                .respond(200, data);
            
            patient.get(patient.data);

            $httpBackend.flush();
        }

        function TestDeletePatient() {
            patient.data = data;

            $httpBackend.expect('DELETE', '/paciente/' + data.Identificacion)
                .respond(200, {});

            patient.del(patient.data);
            $httpBackend.flush();

            expect(patient.data.Identificacion).toBe(undefined);
        }

        function TestGetAndPopulate() {
            $httpBackend.expectGET('/paciente/' + data.Identificacion)
                .respond(200, data);
            
            patient.data.Identificacion = data.Identificacion;
            patient.get(patient.data);
            $httpBackend.flush();

            expect(patient.data.Nombres).toBe(data.Nombres);
            expect(patient.data.PrimerApellido).toBe(data.PrimerApellido);
            expect(patient.data.SegundoApellido).toBe(data.SegundoApellido);
        }


        function TestCreatePatient() {
            $httpBackend.expectPOST('/paciente', data, {Authorization: 'algo'})
                .respond(201);

            patient.data = data;

            patient.create(patient.data);

            $httpBackend.flush();
        }

        function TestUpdatePatient() {
            $httpBackend.expect('PUT', '/paciente/' + data.Identificacion)
                .respond(200);
            patient.data = data;
            patient.update(patient.data);
            $httpBackend.flush();
        }
    });
})();
