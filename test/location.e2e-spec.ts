import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from './database.config';
import { DataSource } from 'typeorm';

describe('LocationController (e2e)', () => {
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
        await dataSource.synchronize(true);
    });

    afterAll(async () => {
        await app.close();
    });

    let createdRenterId: number;
    let createdLocationId: number;

    describe('Renter Endpoints', () => {
        it('/renters (POST) - should create a renter', () => {
            const uniqueEmail = `test.renter.${Date.now()}@example.com`;
            return request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'Test Renter',
                    email: uniqueEmail,
                    phone: '+1234567890',
                    type: 'individual',
                    address: '123 Test Street',
                })
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('id');
                    expect(response.body.name).toBe('Test Renter');
                    expect(response.body.email).toBe(uniqueEmail);
                    createdRenterId = response.body.id;
                });
        });

        it('/renters (GET) - should return all renters', () => {
            return request(app.getHttpServer())
                .get('/renters')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body.length).toBeGreaterThan(0);
                });
        });

        it('/renters/:id (GET) - should return a specific renter', () => {
            return request(app.getHttpServer())
                .get(`/renters/${createdRenterId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(createdRenterId);
                    expect(response.body.name).toBe('Test Renter');
                });
        });

        it('/renters/type/:type (GET) - should return renters by type', () => {
            return request(app.getHttpServer())
                .get('/renters/type/individual')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });
    });

    describe('Location Endpoints', () => {
        it('/locations (POST) - should create a location', () => {
            return request(app.getHttpServer())
                .post('/locations')
                .send({
                    name: 'Test Location',
                    description: 'A test location',
                    price: 100.50,
                    type: 'car',
                    isAvailable: true,
                    renterId: createdRenterId,
                })
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('id');
                    expect(response.body.name).toBe('Test Location');
                    expect(response.body.price).toBe(100.50);
                    createdLocationId = response.body.id;
                });
        });

        it('/locations (GET) - should return all locations', () => {
            return request(app.getHttpServer())
                .get('/locations')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body.length).toBeGreaterThan(0);
                });
        });

        it('/locations/:id (GET) - should return a specific location', () => {
            return request(app.getHttpServer())
                .get(`/locations/${createdLocationId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(createdLocationId);
                    expect(response.body.name).toBe('Test Location');
                });
        });

        it('/locations/renter/:renterId (GET) - should return locations by renter', () => {
            return request(app.getHttpServer())
                .get(`/locations/renter/${createdRenterId}`)
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });

        it('/locations/type/:type (GET) - should return locations by type', () => {
            return request(app.getHttpServer())
                .get('/locations/type/car')
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });

        it('/locations/:id (PUT) - should update a location', () => {
            return request(app.getHttpServer())
                .put(`/locations/${createdLocationId}`)
                .send({
                    name: 'Updated Location',
                    price: 150.75,
                })
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe('Updated Location');
                    // Le prix peut être retourné comme string depuis PostgreSQL
                    const price = parseFloat(response.body.price);
                    expect(price).toBe(150.75);
                });
        });

        it('/locations/:id (DELETE) - should delete a location', () => {
            return request(app.getHttpServer())
                .delete(`/locations/${createdLocationId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.message).toBe('Location deleted successfully');
                });
        });
    });

    describe('Error Handling', () => {
        it('/renters/9999 (GET) - should return 404 for non-existent renter', () => {
            return request(app.getHttpServer())
                .get('/renters/9999')
                .expect(404);
        });

        it('/locations/9999 (GET) - should return 404 for non-existent location', () => {
            return request(app.getHttpServer())
                .get('/locations/9999')
                .expect(404);
        });

        it('/renters (POST) - should return 409 for duplicate email', async () => {
            const duplicateEmail = `duplicate.${Date.now()}@example.com`;

            await request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'First Renter',
                    email: duplicateEmail,
                    type: 'individual',
                })
                .expect(201);

            return request(app.getHttpServer())
                .post('/renters')
                .send({
                    name: 'Second Renter',
                    email: duplicateEmail,
                    type: 'company',
                })
                .expect(409);
        });
    });
});