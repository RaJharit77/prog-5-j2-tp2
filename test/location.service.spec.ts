import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationService } from '../src/modules/location/services/location.service';
import { LocationRepository } from '../src/modules/location/repositories/location.repository';
import { Location } from '../src/modules/location/entities/location.entity';
import { EntityNotFoundException } from '../src/common/exceptions/entity-not-found.exception';

describe('LocationService', () => {
    let service: LocationService;
    let repository: LocationRepository;

    const mockLocationRepository = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationService,
                {
                    provide: LocationRepository,
                    useValue: mockLocationRepository,
                },
            ],
        }).compile();

        service = module.get<LocationService>(LocationService);
        repository = module.get<LocationRepository>(LocationRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findById', () => {
        it('should return a location if found', async () => {
            const location = { id: 1, name: 'Test Location' };
            mockLocationRepository.findById.mockResolvedValue(location);

            const result = await service.findById(1);
            expect(result).toEqual(location);
        });

        it('should throw EntityNotFoundException if location not found', async () => {
            mockLocationRepository.findById.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(EntityNotFoundException);
        });
    });
});