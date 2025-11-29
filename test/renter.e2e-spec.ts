import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from './database.config';
import { DataSource } from 'typeorm';

describe('RenterController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TypeOrmModule.forRoot(testDatabaseConfig),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = moduleFixture.get(DataSource);
        // Nettoyer la base de données avant les tests
        await dataSource.synchronize(true);
    });

    afterAll(async () => {
        await app.close();
    });

    let createdRenterId: number;

    describe('Renter CRUD Operations', () => {
        it('should create a new renter', () => {
            const uniqueEmail = `e2e.test.${Date.now()}@example.com`;
            return request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'E2E Test Renter',
                    email: uniqueEmail,
                    phone: '+1234567890',
                    type: 'individual',
                    address: '456 Test Ave',
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).toBeDefined();
                    expect(response.body.name).toBe('E2E Test Renter');
                    expect(response.body.email).toBe(uniqueEmail);
                    createdRenterId = response.body.id;
                });
        });

        it('should get all renters', () => {
            return request(app.getHttpServer())
                .get('/renters')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body.length).toBeGreaterThan(0);
                });
        });

        it('should get renter by ID', () => {
            return request(app.getHttpServer())
                .get(`/renters/${createdRenterId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(createdRenterId);
                    expect(response.body.name).toBe('E2E Test Renter');
                });
        });

        it('should update renter', () => {
            return request(app.getHttpServer())
                .put(`/renters/${createdRenterId}`)
                .send({
                    name: 'Updated E2E Renter',
                    address: '789 Updated Street',
                })
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe('Updated E2E Renter');
                    expect(response.body.address).toBe('789 Updated Street');
                });
        });

        it('should get renters by type', () => {
            return request(app.getHttpServer())
                .get('/renters/type/individual')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body[0].type).toBe('individual');
                });
        });

        it('should delete renter', () => {
            return request(app.getHttpServer())
                .delete(`/renters/${createdRenterId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.message).toBe('Renter deleted successfully');
                });
        });
    });

    describe('Validation Tests', () => {
        it('should reject duplicate email', async () => {
            const duplicateEmail = `duplicate.${Date.now()}@example.com`;

            // Créer d'abord un renter
            await request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'First Renter',
                    email: duplicateEmail,
                    type: 'individual',
                })
                .expect(201);

            // Essayer de créer un autre renter avec le même email
            await request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'Second Renter',
                    email: duplicateEmail,
                    type: 'individual',
                })
                .expect(409) // Doit être 409 pour conflit d'email
                .then((response) => {
                    expect(response.body.message).toContain('already exists');
                });
        });
    });
});